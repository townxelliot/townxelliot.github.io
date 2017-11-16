define(
[
  'lsystem-ruleset',
  'lsystem-module',
  'lsystem-deterministic',
],
function (LRS, LM, LD) {
  // based on example 2 of the L-System page on wikipedia
  // http://en.wikipedia.org/wiki/L-system

  // BASIC BRANCHING
  var branchingRule1 = LD.parseRule('1 -> 11');
  var branchingRule2 = LD.parseRule('0 -> 1[0]0');
  var branchingAxiom = LM('0');
  var branchingRuleset = LRS(branchingAxiom);
  branchingRuleset.addRules(branchingRule1, branchingRule2);

  var branchingSpec = {
    ruleset: branchingRuleset,

    iterations: 8,

    turtleStart: { x: 0, y: -300, heading: 0 },

    /*
    0: draw a line segment ending in a leaf (treated the same as
       a line segment here)
    1: draw a line segment
    [: push position and angle, turn left 45 degrees
    ]: pop position and angle, turn right 45 degrees
    */
    commands: {
      '0': function (turtle) {
        turtle.fd(2);
      },
      '1': function (turtle) {
        turtle.fd(2)
      },
      '[': function (turtle) {
        turtle.storeState();
        turtle.lt(45);
      },
      ']': function (turtle) {
        turtle.restoreState();
        turtle.rt(45);
      }
    }
  };

  // SIERPINSKI TRIANGLE
  var triangleRule1 = LD.parseRule('A -> B-A-B');
  var triangleRule2 = LD.parseRule('B -> A+B+A');
  var triangleAxiom = LM('A');
  var triangleRuleset = LRS(triangleAxiom);
  triangleRuleset.addRules(triangleRule1, triangleRule2);

  var triangleSpec = {
    ruleset: triangleRuleset,

    iterations: 8,

    turtleStart: { x: 120, y: -60, heading: -30 },

    commands: {
      'A': function (turtle) {
        turtle.fd(1);
      },
      'B': function (turtle) {
        turtle.fd(1)
      },
      '+': function (turtle) {
        turtle.lt(60);
      },
      '-': function (turtle) {
        turtle.rt(60);
      }
    }
  };

  // SIMPLE PLANT
  var plantRule1 = LD.parseRule('X -> F-[[X]+X]+F[+FX]-X');
  var plantRule2 = LD.parseRule('F -> FF');
  var plantAxiom = LM('X');
  var plantRuleset = LRS(plantAxiom);
  plantRuleset.addRules(plantRule1, plantRule2);

  var plantSpec = {
    ruleset: plantRuleset,

    iterations: 6,

    turtleStart: { x: 0, y: -300, heading: 0 },

    /*
    0: draw a line segment ending in a leaf (treated the same as
       a line segment here)
    1: draw a line segment
    [: push position and angle, turn left 45 degrees
    ]: pop position and angle, turn right 45 degrees
    */
    commands: {
      'F': function (turtle) {
        turtle.fd(2);
      },
      'X': null,
      '-': function (turtle) {
        turtle.lt(25);
      },
      '+': function (turtle) {
        turtle.rt(25);
      },
      '[': function (turtle) {
        turtle.storeState();
      },
      ']': function (turtle) {
        turtle.restoreState();
      }
    }
  };

  // SIMPLE PLANT
  var plant2Rule1 = LD.parseRule('X -> F[+X][-X]FX');
  var plant2Rule2 = LD.parseRule('F -> FF');
  var plant2Axiom = LM('X');
  var plant2Ruleset = LRS(plant2Axiom);
  plant2Ruleset.addRules(plant2Rule1, plant2Rule2);

  var plant2Spec = {
    ruleset: plant2Ruleset,

    iterations: 7,

    turtleStart: { x: 0, y: -300, heading: 0 },

    commands: {
      'F': function (turtle) {
        turtle.fd(2);
      },
      'X': null,
      '-': function (turtle) {
        turtle.lt(25.7);
      },
      '+': function (turtle) {
        turtle.rt(25.7);
      },
      '[': function (turtle) {
        turtle.storeState();
      },
      ']': function (turtle) {
        turtle.restoreState();
      }
    }
  };

  // KOCH CURVE
  var kochRule1 = LD.parseRule('F -> F-F++F-F');
  var kochAxiom = [LM('F'), LM('+'), LM('+'), LM('F'), LM('+'), LM('+'), LM('F')];
  var kochRuleset = LRS(kochAxiom);
  kochRuleset.addRule(kochRule1);

  var kochSpec = {
    ruleset: kochRuleset,

    iterations: 4,

    turtleStart: { x: -160, y: 120, heading: 90 },

    commands: {
      'F': function (turtle) {
        turtle.fd(4);
      },
      '-': function (turtle) {
        turtle.lt(60);
      },
      '+': function (turtle) {
        turtle.rt(60);
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

    turtleStart: { x: 60, y: -60, heading: 0 },

    commands: {
      'F': function (turtle) {
        turtle.fd(4);
      },
      '-': function (turtle) {
        turtle.lt(90);
      },
      '+': function (turtle) {
        turtle.rt(90);
      }
    }
  };

  // KOCH CURVE
  var curveRule1 = LD.parseRule('F -> FF-F+F-F-FF');
  var curveAxiom = [LM('F'), LM('-'), LM('F'), LM('-'), LM('F'), LM('-'), LM('F')];
  var curveRuleset = LRS(curveAxiom);
  curveRuleset.addRule(curveRule1);

  var curveSpec = {
    ruleset: curveRuleset,

    iterations: 3,

    turtleStart: { x: -40, y: 100, heading: 0 },

    commands: {
      'F': function (turtle) {
        turtle.fd(15);
      },
      '-': function (turtle) {
        turtle.lt(90);
      },
      '+': function (turtle) {
        turtle.rt(90);
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

    iterations: 4,

    turtleStart: { x: 150, y: -150, heading: 0 },

    commands: {
      'F': function (turtle) {
        turtle.fd(4);
      },
      '-': function (turtle) {
        turtle.lt(90);
      },
      '+': function (turtle) {
        turtle.rt(90);
      }
    }
  };

  return {
    'simple branching': branchingSpec,
    'simple plant': plantSpec,
    'another plant': plant2Spec,
    'Sierpinski triangle': triangleSpec,
    'squaRecurve': squaRecurveSpec,
    'Koch snowflake': kochSpec,
    'Koch island': islandSpec,
    'another Koch curve': curveSpec
  }
})
