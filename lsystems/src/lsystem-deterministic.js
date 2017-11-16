(function () {
  var construct = function (LsystemModule, LsystemRule) {

    // parser to create LsystemRules from typical deterministic
    // L-System rule strings, e.g. A -> BCD
    //
    // LsystemModule: factory function for modules
    // LsystemRule: factory function for rules
    var LsystemDeterministic = {};

    // produce an LsystemRule from a string in the form "A -> B",
    // where A is the predecessor (left-hand side) of the
    // production and B the successor; note that the left-hand
    // side should only have a single symbol, while the right
    // can have multiple symbols; also note that we assume a
    // symbol is a single character: we don't cater for multi-character
    // symbols in the alphabet
    LsystemDeterministic.parseRule = function (str) {
      var parts = str.replace(/[ ]+/g, '').split(/->/);

      if (parts.length !== 2) {
        throw new Error('rule must have the format "X -> Y"');
      }

      var lhSymbol = parts[0];
      var rhSymbols = parts[1];

      var test = function (module, preceding, following) {
        return module.hasSymbol(lhSymbol);
      };

      var transform = function (module, preceding, following) {
        var rhModules = [];

        for (var i = 0; i < rhSymbols.length; i++) {
          rhModules.push(LsystemModule(rhSymbols[i]));
        }

        return rhModules;
      };

      return LsystemRule(test, transform);
    };

    return LsystemDeterministic;
  };

  if (typeof module !== 'undefined' && module.exports) {
    var LsystemModule = require('./lsystem-module');
    var LsystemRule = require('./lsystem-rule');
    module.exports = construct(LsystemModule, LsystemRule);
  }
  else if (typeof define !== 'undefined' && define.amd) {
    define(['lsystem-module', 'lsystem-rule'], function (LsystemModule, LsystemRule) {
      return construct(LsystemModule, LsystemRule);
    });
  }
  else {
    window.LsystemDeterministic = construct(
      window.LsystemModule,
      window.LsystemRule
    );
  }
})();
