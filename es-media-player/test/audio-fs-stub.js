define(['lodash', 'jquery', 'stapes'], function (_, $, Stapes) {
  var oggBase = require.toUrl('../../test/fixtures');

  var files = [
    {
      filename: 'c',
      url: oggBase + '/reading.ogg',
      meta: {
        album: 'Wagner tracks',
        title: 'Wagner 3',
        artist: 'Wagner',
        tracknum: 3
      }
    },

    {
      filename: 'b',
      url: oggBase + '/wagner-short.ogg',
      meta: {
        album: 'Wagner tracks',
        title: 'Wagner 2',
        artist: 'Wagner',
        tracknum: 2
      }
    },

    {
      filename: 'a',
      url: oggBase + '/reading.ogg',
      meta: {
        album: 'Wagner tracks',
        title: 'Wagner 1',
        artist: 'Wagner',
        tracknum: 1
      }
    },

    {
      filename: 'h',
      url: oggBase + '/reading.ogg',
      meta: {
        title: 'I Want My Mixer',
        artist: 'Peter Blob'
      }
    },

    {
      filename: 'e',
      url: oggBase + '/wagner-short.ogg',
      meta: {
        album: 'Mighty War Music',
        title: 'Holy Moses!',
        artist: 'Frankie Moonlight',
        tracknum: 2
      }
    },

    {
      filename: 'd',
      url: oggBase + '/wagner-short.ogg',
      meta: {
        album: 'Mighty War Music',
        title: 'Briefs Encounter',
        artist: 'Charley Hassle',
        tracknum: 1
      }
    },

    {
      filename: 'f',
      url: oggBase + '/reading.ogg',
      meta: {
        album: 'An Elaborate Evening\'s Entertainment with the Jocular Fellows',
        title: 'I Have a Little Tree',
        artist: 'Charley Hassle',
        tracknum: 1
      }
    },

    {
      filename: 'g',
      url: oggBase + '/wagner-short.ogg',
      meta: {
        title: 'I\'m Forever Wondering Where I Left My Hat, Presumably At Home',
        artist: 'Frankie Moonlight'
      }
    }
  ];

  var obj = {
    getAllFiles: function () {
      var dfd = $.Deferred();
      dfd.resolve(files);
      return dfd.promise();
    },

    getFile: function (filename) {
      var dfd = $.Deferred();

      dfd.resolve(_.select(files, function (file) {
        return file.filename === filename;
      })[0]);

      return dfd.promise();
    }
  };

  return obj;
});
