(function () {
  var construct = function (_, UUID) {
    // symbol: a symbol from the alphabet
    // parameters:
    // config.parameters: key-value pairs representing parameters
    // to store in the module (default: {})
    // config.id: ID to set for the module (default: random UUID)
    var LsystemModule = function (symbol, config) {
      config = config || {};

      var obj = {};

      obj.symbol = symbol;
      obj.parameters = _.clone(config.parameters) || {};
      obj.id = config.id || UUID.v4();

      obj.getParameter = function (key) {
        return obj.parameters[key];
      };

      obj.setParameter = function (key, value) {
        obj.parameters[key] = value;
      };

      obj.hasSymbol = function (symbolToCompare) {
        return obj.symbol === symbolToCompare;
      };

      obj.clone = function () {
        return _.clone(obj);
      };

      return obj;
    };

    return LsystemModule;
  };

  if (typeof module !== 'undefined' && module.exports) {
    var _ = require('lodash');
    var UUID = require('node-uuid');
    module.exports = construct(_, UUID);
  }
  else if (typeof define !== 'undefined' && define.amd) {
    define(['lodash', 'uuid'], function (_, UUID) {
      return construct(_, UUID);
    });
  }
  else {
    window.LsystemModule = construct(window._, window.UUID);
  }
})();
