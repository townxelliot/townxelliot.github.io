define(
[
  'lsystem-ruleset',
  'lsystem-module',
  'lsystem-deterministic',
],
function (LRS, LM, LD) {
  // based on example 2 of the L-System page on wikipedia
  // http://en.wikipedia.org/wiki/L-system

  // SIMPLE PLANT
  var plantRule1 = LD.parseRule('X -> F-[[X]+X]+F[+FX]-X');
  var plantRule2 = LD.parseRule('F -> FF');
  var plantAxiom = LM('X');
  var plantRuleset = LRS(plantAxiom);
  plantRuleset.addRules(plantRule1, plantRule2);

  var plantSpec = {
    ruleset: plantRuleset,

    iterations: 5,

    turtleStart: {
      position: { x: 300, y: 600, z: 0 },
      heading: { x: 0, y: 0, z: 0}
    },

    /*
    0: draw a line segment ending in a leaf (treated the same as
       a line segment here)
    1: draw a line segment
    [: push position and angle, turn left 45 degrees
    ]: pop position and angle, turn right 45 degrees
    */
    commands: {
      'F': function (turtle) {
        turtle.forward(5);
      },
      'X': null,
      '-': function (turtle) {
        turtle.turnLeft(25);
      },
      '+': function (turtle) {
        turtle.turnRight(25);
      },
      '[': function (turtle) {
        turtle.storeState();
      },
      ']': function (turtle) {
        turtle.restoreState();
      }
    }
  };

  // BASIC BRANCHING
  var branchingRule1 = LD.parseRule('1 -> 11');
  var branchingRule2 = LD.parseRule('0 -> 1[0]0');
  var branchingAxiom = LM('0');
  var branchingRuleset = LRS(branchingAxiom);
  branchingRuleset.addRules(branchingRule1, branchingRule2);

  var branchingSpec = {
    ruleset: branchingRuleset,

    iterations: 8,

    turtleStart: {
      position: { x: 300, y: 600, z: 0 },
      heading: { x: 0, y: 0, z: 0 }
    },

    /*
    0: draw a line segment ending in a leaf (treated the same as
       a line segment here)
    1: draw a line segment
    [: push position and angle, turn left 45 degrees
    ]: pop position and angle, turn right 45 degrees
    */
    commands: {
      '0': function (turtle) {
        turtle.forward(2);
      },
      '1': function (turtle) {
        turtle.forward(2)
      },
      '[': function (turtle) {
        turtle.storeState();
        turtle.turnLeft(45);
      },
      ']': function (turtle) {
        turtle.restoreState();
        turtle.turnRight(45);
      }
    }
  };

  return {
    'simple plant': plantSpec,
    'branching': branchingSpec
  }
})
