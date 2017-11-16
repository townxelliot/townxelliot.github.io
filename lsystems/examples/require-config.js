require.config({
  baseUrl: '.',

  deps: ['main'],

  urlArgs: 'bust=' + (new Date()).getTime(),

  paths: {
    'lodash': '../../lib/lodash.compat-1.0.1',
    'uuid': '../../lib/uuid-1.4.0',

    'turtle': '../lib/jtg',
    'jq': '../lib/jq.mobi',
    'sylvester': '../lib/sylvester-0.1.3',
    'sprite3d': '../lib/Sprite3D-2.0.1',
    'threejs': '../lib/three-r56',
    'domReady': '../lib/require-domReady-2.0.1',

    'lsystem-rule': '../../src/lsystem-rule',
    'lsystem-ruleset': '../../src/lsystem-ruleset',
    'lsystem-module': '../../src/lsystem-module',
    'lsystem-deterministic': '../../src/lsystem-deterministic'
  },

  shim: {
    'turtle': {
      exports: 'Turtle'
    },
    'uuid': {
      exports: 'UUID'
    },
    'lodash': {
      exports: '_'
    },
    'jq': {
      exports: '$'
    },
    'sprite3d': {
      exports: 'Sprite3D'
    },
    'sylvester': {
      exports: function () {
        return {Vector: Vector, Matrix: Matrix, Line: Line, Plane: Plane};
      }
    },
    'threejs': {
      exports: 'THREE'
    }
  }
});
