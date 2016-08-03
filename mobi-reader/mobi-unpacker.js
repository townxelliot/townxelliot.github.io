// see http://wiki.mobileread.com/wiki/MOBI for more detail
// on typical sections added by mobi creator tools;
// https://github.com/siebert/mobiunpack was very helpful, and
// much of the code here is based on that
define(['bops'], function (binary) {
  var HUFFMAN_ENCODING = 17480;

  var MobiUnpacker = function () {};

  var getRecords = function (content) {
    // get header (first 78 bytes)
    var header = new Uint8Array(content.slice(0, 78));

    // number of sections in the db
    var numSections = binary.readInt16BE(header, 76);

    // get offsets for each chunk of section data by parsing the
    // section records: the offsets mark the points in the file where
    // the data sections start; we can pull the data for a section
    // by retrieving the slice between the offset for a section and
    // the offset of the next section
    var sectionOffsets = [];

    // section records start at byte 78
    var startSectionRecord = 78;
    var endSectionRecord;

    for (var i = 0; i < numSections; i++) {
      // a record for a section is an 8 byte structure
      endSectionRecord = startSectionRecord + 8;
      sectionRecord = new Uint8Array(content.slice(startSectionRecord, endSectionRecord));

      // the first 4 bytes of the section record define the offset of the section data
      sectionDataOffset = binary.readInt32BE(sectionRecord, 0);

      sectionOffsets.push(sectionDataOffset);
      startSectionRecord = endSectionRecord;
    }

    // get the data for the sections; section 0 is a metadata section
    // which includes info about the compression etc.; NB at this point
    // sections 1+ may be compressed; see http://wiki.mobileread.com/wiki/MOBI
    // for a description of the record entries
    var sections = [];
    var sectionDataStart;
    var sectionDataEnd;
    var sectionData;

    for (var i = 0; i < numSections; i++) {
      sectionDataStart = sectionOffsets[i];

      if (i === numSections - 1) {
        sectionDataEnd = content.length;
      }
      else {
        sectionDataEnd = sectionOffsets[i+1];
      }

      sectionData = content.slice(sectionDataStart, sectionDataEnd);
      sections.push(sectionData);
    }

    return sections;
  };

  // see http://wiki.mobileread.com/wiki/PalmDOC#Format for PalmDOC format
  var palmUncompress = function (data) {
    data = new Uint8Array(data);

    var out = binary.create(0);
    var buf = new Uint8Array(1);

    // buffer representing a single space character
    var space = binary.create(1);
    binary.writeUInt8(space, 32, 0);

    var p = 0;
    var _byte;
    var backReference;
    var numBytesToCopy;
    var chunkStart;
    var chunkEnd;

    while (p < data.length) {
      _byte = data[p];
      p += 1;

      if (_byte >= 1 && _byte <= 8) {
        chunkEnd = p + _byte;
        if (chunkEnd > data.length) {
          chunkEnd = data.length;
        }

        out = binary.join([out, binary.subarray(data, p, chunkEnd)]);

        p += _byte;
      }
      else if (_byte < 128) {
        binary.writeUInt8(buf, _byte, 0);
        out = binary.join([out, buf]);
      }
      else if (_byte >= 192) {
        binary.writeUInt8(buf, _byte ^ 0x80, 0);
        out = binary.join([out, space, buf]);
      }
      else if (p < data.length) {
        // combine with the 8 bits of the next byte (to give 16 bits)
        _byte = (_byte << 8) | data[p];

        // the first 11 bits of the result is the distance back from
        // the current location to copy from; as 0x7ff is 11 bits
        // long, and we are &'ing it with this byte + following byte,
        // we discard the 2 left-most bits of this byte, then
        // get the remaining left-most 11 bits of this byte + the
        // following byte
        backReference = (_byte >> 3) & 0x07ff;

        // the remaining 3 bits on the right is added to 3 to get the
        // number of bytes to copy from that back reference forward
        numBytesToCopy = (_byte & 7) + 3;

        // copy the slice from backReference to backReference + numBytesToCopy
        // in the _uncompressed_ string; NB if the backReference is less
        // than or equal to the number of bytes to copy, we just repeatedly
        // copy the byte at -backReference
        if (numBytesToCopy < backReference) {
          chunkStart = out.length - backReference;
          chunkEnd = chunkStart + numBytesToCopy;
          out = binary.join([out, binary.subarray(out, chunkStart, chunkEnd)]);
        }
        else {
          for (var j = 0; j < numBytesToCopy; j++) {
            chunkStart = out.length - backReference;
            chunkEnd = chunkStart + 1;
            out = binary.join([out, binary.subarray(out, chunkStart, chunkEnd)]);
          }
        }

        // we've used the next byte, so skip it
        p += 1;
      }
    }

    return out;
  };

  var getMeta = function (record0) {
    var metaRecord = new Uint8Array(record0);

    // encrypted?
    var encryption = binary.readInt16BE(metaRecord, 12);

    // text encoding: 1252 === CP1252 (WinLatin1);
    // 65001 === UTF-8
    var encodingValue = binary.readInt32BE(metaRecord, 28);
    var encoding = 'utf8';
    if (encodingValue === 1252) {
      encoding = 'latin1'
    }

    // mobipocket version
    var version = binary.readInt32BE(metaRecord, 36);

    // figure out the type of compression: 1 == not compressed,
    // 0x4448 == Huffman/cdic compression, 2 == Palmdoc compression
    var uncompress = function (data) {
      return data;
    };

    var compression = binary.readInt16BE(metaRecord, 0);

    if (compression === 2) {
      uncompress = palmUncompress;
    }

    // which records are actually text or images
    var firstContentRecord = binary.readInt16BE(metaRecord, 192);
    var recordCount = binary.readInt16BE(metaRecord, 8);
    var lastContentRecord = firstContentRecord + recordCount;

    return {
      version: version,
      encoding: encoding,
      encryption: encryption,
      compression: compression,
      uncompress: uncompress,
      firstContentRecord: firstContentRecord,
      lastContentRecord: lastContentRecord
    };
  };

  // content is a Buffer of mobipocket data, as returned by reading
  // a .mobi file via node.js
  MobiUnpacker.prototype.getHtml = function (content) {
    var records = getRecords(content);
    var meta = getMeta(records[0]);
    console.log(meta);

    // sanity tests
    if (meta.compression === HUFFMAN_ENCODING) {
      throw new Error("Can't do Huffman unpacking yet...");
    }

    if (meta.encryption !== 0) {
      throw new Error("Can't handle encrypted files");
    }

    // decompress sections, taking each individually and concatenating to
    // get the full text
    var html = binary.create(0);
    for (var i = meta.firstContentRecord; i < meta.lastContentRecord; i++) {
      html = binary.join([html, meta.uncompress(records[i])]);
    }

    return binary.to(html, 'utf8');
  };

  return MobiUnpacker;
});
