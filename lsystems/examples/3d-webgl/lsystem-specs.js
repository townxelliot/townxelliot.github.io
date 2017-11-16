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
      position: { x: 0, y: -600, z: 0 },
      heading: { x: 0, y: 0, z: -180}
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
        turtle.forward(10);
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
      position: { x: 0, y: -600, z: 0 },
      heading: { x: 0, y: 0, z: -180 }
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
        turtle.forward(3);
      },
      '1': function (turtle) {
        turtle.forward(3)
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

  // ANOTHER SIMPLE PLANT
  var plant2Rule1 = LD.parseRule('X -> F[+X][-X]FX');
  var plant2Rule2 = LD.parseRule('F -> FF');
  var plant2Axiom = LM('X');
  var plant2Ruleset = LRS(plant2Axiom);
  plant2Ruleset.addRules(plant2Rule1, plant2Rule2);

  var plant2Spec = {
    ruleset: plant2Ruleset,

    iterations: 7,

    turtleStart: {
      position: { x: 0, y: -600, z: 0 },
      heading: { x: 0, y: 0, z: -180 }
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
        turtle.forward(3);
      },
      'X': null,
      '-': function (turtle) {
        turtle.turnRight(30);
      },
      '+': function (turtle) {
        turtle.turnLeft(30);
      },
      '[': function (turtle) {
        turtle.storeState();
      },
      ']': function (turtle) {
        turtle.restoreState();
      }
    }
  };

  // KOCH ISLAND
  var islandRule1 = LD.parseRule('F -> F+FF-FF-F-F+F+FF-F-F+F+FF+FF-F');
  var islandAxiom = [LM('F'), LM('-'), LM('F'), LM('-'), LM('F'), LM('-'), LM('F')];
  var islandRuleset = LRS(islandAxiom);
  islandRuleset.addRule(islandRule1);

  var islandSpec = {
    ruleset: islandRuleset,

    iterations: 2,

    turtleStart: {
      position: { x: 0, y: -100, z: 0 },
      heading: { x: 0, y: 0, z: -180 }
    },

    commands: {
      'F': function (turtle) {
        turtle.forward(10);
      },
      '-': function (turtle) {
        turtle.turnLeft(90);
      },
      '+': function (turtle) {
        turtle.turnRight(90);
      }
    }
  };

  // SQUARECURVE
  var squaRecurveRule1 = LD.parseRule('L -> LF+RFR+FL-F-LFLFL-FRFR+');
  var squaRecurveRule2 = LD.parseRule('R -> -LFLF+RFRFR+F+RF-LFL-FR');
  var squaRecurveAxiom = [LM('-'), LM('L')];
  var squaRecurveRuleset = LRS(squaRecurveAxiom);
  squaRecurveRuleset.addRules(squaRecurveRule1, squaRecurveRule2);

  var squaRecurveSpec = {
    ruleset: squaRecurveRuleset,

    iterations: 3,

    turtleStart: {
      position: { x: 0, y: -200, z: 0 },
      heading: { x: 0, y: 0, z: -180 }
    },

    commands: {
      'F': function (turtle) {
        turtle.forward(20);
      },
      '-': function (turtle) {
        turtle.turnLeft(90);
      },
      '+': function (turtle) {
        turtle.turnRight(90);
      }
    }
  };

  return {
    'simple plant': plantSpec,
    'another plant': plant2Spec,
    'branching': branchingSpec,
    'Koch island': islandSpec,
    'squaRecurve': squaRecurveSpec
  }
})
