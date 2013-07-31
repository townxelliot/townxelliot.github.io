require.config({
  paths: {
    'af': 'bower_components/intel-appframework/appframework',
    'bops': 'bower_components/bops/dist/bops'
  },

  shim: {
    'af': {
      exports: '$'
    }
  }
});

require(
[
  'mobi-unpacker',
  'af',
  'bower_components/requirejs-domready/domReady!'
], function (MobiUnpacker, $) {
  // pull the content of the body from a full HTML page
  var getBody = function (html) {
    var body = '';

    var regex = /\<body\>([\s\S]+)\<\/body\>/m;
    var matches = html.match(regex);

    if (matches) {
      body = matches[1];
    }

    return body;
  };

  var unpacker = new MobiUnpacker();

  var localFileElt = document.getElementById('local-file-to-process');
  var localBtnElt = document.getElementById('local-file');

  var reader = new FileReader();

  reader.onload = function (e) {
    var buffer = e.target.result;
    var html = unpacker.getHtml(buffer);
    var body = getBody(html);
    $('#content').html(body);
  };

  reader.onerror = function (e) {
    if (e.target.error.name == "NotReadableError") {
      console.error('could not read from file');
    }
  };

  // local file handler
  localBtnElt.addEventListener('click', function () {
    if (!localFileElt.files.length) {
      return;
    }

    var blob = localFileElt.files[0].slice(0);
    reader.readAsArrayBuffer(blob);
  });
});
