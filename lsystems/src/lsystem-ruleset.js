(function () {
  var construct = function (_) {
    // start: starting module(s)
    var LsystemRuleset = function (start) {
      var obj = {};

      var rules = [];

      obj.addRule = function (rule) {
        rules.push(rule);
      };

      obj.addRules = function () {
        for (var i = 0; i < arguments.length; i++) {
          obj.addRule(arguments[i]);
        }
      };

      obj.getRules = function () {
        return rules;
      };

      obj.getStep = function () {
        return step;
      };

      obj.step = function () {
        // for each module in "state", we try to apply one of
        // the rules in the ruleset; as soon as we succeed, we
        // move on to the next module
        var result = [];
        var module;
        var preceding;
        var following;

        for (var i = 0; i < obj.state.length; i++) {
          var replaceWith = null;

          module = obj.state[i];
          preceding = obj.state.slice(0, i);
          following = obj.state.slice(i + 1);

          for (var j = 0; j < rules.length; j++) {
            replaceWith = rules[j].applyTo(module, preceding, following);

            if (replaceWith.touched) {
              break;
            }
          }

          // no rules matched
          if (replaceWith === null) {
            replaceWith = module;
          }

          if (_.isArray(replaceWith)) {
            result = result.concat(replaceWith);
          }
          else {
            result.push(replaceWith);
          }
        }

        obj.state = result;
      };

      obj.reset = function () {
        step = 0;

        obj.state = start;
        if (!_.isArray(start)) {
          obj.state = [start];
        }
      };

      // initialise
      obj.reset();

      return obj;
    };

    return LsystemRuleset;
  }

  if (typeof module !== 'undefined' && module.exports) {
    var _ = require('lodash');
    module.exports = construct(_);
  }
  else if (typeof define !== 'undefined' && define.amd) {
    define(['lodash'], function (_) {
      return construct(_);
    });
  }
  else {
    window.LsystemRuleset = construct(window._);
  }

})();
