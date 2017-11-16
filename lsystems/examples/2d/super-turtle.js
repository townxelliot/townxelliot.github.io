define(['turtle', 'lodash'], function (Turtle, _) {
  var SuperTurtle = function (canvas) {
    var obj = {};

    var states = [];
    var interval = null;

    var turtle = new Turtle(canvas);

    _.extend(obj, turtle);

    obj.storeState = function () {
      var stateToSave = {};
      stateToSave.x = turtle.get.x();
      stateToSave.y = turtle.get.y();
      stateToSave.heading = turtle.get.heading();
      states.push(stateToSave);
    };

    obj.restoreState = function () {
      var poppedState = states.pop();
      turtle.pu();
      turtle.xy(poppedState.x, poppedState.y);
      turtle.heading(poppedState.heading);
      turtle.pd();
    };

    // pause: pause between drawing steps, in ms (for setInterval());
    // 0 = no pause
    obj.runSpec = function (spec, pause) {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }

      var turtleStartState = spec.turtleStart;
      var ruleset = spec.ruleset;
      var commands = spec.commands;

      var runCommand = function (index) {
        var symbol = ruleset.state[index].symbol;
        var cmd = spec.commands[symbol]
        if (cmd) {
          cmd(obj);
        }
      };

      // reset the ruleset
      ruleset.reset();

      // reset turtle states stack
      states = [turtleStartState];

      // clear canvas
      turtle.clean();

      // move turtle to starting position
      turtle.pu();
      turtle.xy(turtleStartState.x, turtleStartState.y);
      turtle.heading(turtleStartState.heading);
      turtle.pd();

      // iterate the ruleset to get its output
      for (var i = 1; i <= spec.iterations; i++) {
        ruleset.step();
      }

      // use spec.commands to do the drawing
      if (pause) {
        var j = 0;

        interval = setInterval(function () {
          runCommand(j);

          j++;

          if (j >= ruleset.state.length) {
            clearInterval(interval);
            interval = null;
          }
        }, pause);
      }
      else {
        for (var j = 0; j < ruleset.state.length; j++) {
          runCommand(j);
        }
      }
    };

    return obj;
  };

  return SuperTurtle;
});
