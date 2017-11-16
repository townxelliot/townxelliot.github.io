(function () {
  var construct = function (_) {
    // test: function to test the content of a module,
    // to determine whether the transform can be applied; returns true/false
    // (NB this could be probabilistic); signature: test(module, preceding, following)
    //
    // transform: function which transforms module to produce a new
    // module which replaces it (the "right-hand side" of the production
    // rule); signature: transform(module, preceding, following), returns
    // one or more modules to replace the existing module
    var LsystemRule = function (test, transform) {
      var obj = {};

      obj.applyTo = function (module, preceding, following) {
        var replaceWith = module;
        replaceWith.touched = false;

        if (test(module, preceding, following)) {
          replaceWith = transform(module, preceding, following);
          replaceWith.touched = true;
        }

        return replaceWith;
      };

      return obj;
    };

    return LsystemRule;
  };

  if (typeof module !== 'undefined' && module.exports) {
    var _ = require('lodash');
    module.exports = construct(_);
  }
  else if (typeof define !== 'undefined' && define.amd) {
    define(['lodash'], function () {
      return construct(_);
    });
  }
  else {
    window.LsystemRule = construct(window._);
  }
})();
