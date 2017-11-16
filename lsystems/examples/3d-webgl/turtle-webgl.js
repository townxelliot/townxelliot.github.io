// a turtle (very minimal at best) in 3D using webgl
// to draw "pipes"
//
// we maintain a "pen point" in 3d space, representing where the "pen"
// is at any point; to draw to another point, we work out where
// that point is, then draw a pipe from the current pen
// position to the new pen position
define(['shapes', 'sylvester', 'lodash'], function (Shapes, Sylvester, _) {
  var degreesToRadians = function (angleDegrees) {
    return angleDegrees * (Math.PI / 180);
  };

  var roundNumber = function (num, places) {
    return Math.round(num * Math.pow(10, places)) / Math.pow(10, places);
  };

  /* Get Sylvester matrix for rotation on a single axis
   *
   * @param {String} axis One of 'x', 'y', 'z' (or the uppercase
   * equivalents)
   */
  var getRotationMatrixForAxis = function (axis, degrees) {
    axis = axis.toUpperCase();
    var radians = degreesToRadians(degrees);
    return Sylvester.Matrix['Rotation' + axis](radians);
  };

  // drawingArea: element to append the three.js renderer to
  return function (drawingArea) {
    var obj = {};

    var states = [];

    var thickness = 6;
    var colour = 0x00dd00;

    // in degrees
    var heading = { x: 0, y: 0, z: 45 };

    // in pixels relative to top-left corner of drawing area
    var position = { x: 0, y: 0, z: 0 };

    var stageWidth = $(drawingArea).width();
    var stageHeight = $(drawingArea).height();

    var stage = Shapes.Stage(stageWidth, stageHeight);
    drawingArea.appendChild(stage.elt);
    stage.render();

    // draw a cuboid along the current heading with height distance
    obj.forward = function (distance) {
      // draw cylinder along heading with length distance
      var cyl = Shapes.ClosedCylinder(
        thickness / 2,
        distance,
        colour,
        position,
        heading
      );

      stage.addShape(cyl);

      // get the position for the centre of the tip of the cuboid
      var start = Sylvester.Vector.create([position.x, position.y, position.z]);

      var rotationX = getRotationMatrixForAxis('x', heading.x);
      var rotationY = getRotationMatrixForAxis('y', heading.y);
      var rotationZ = getRotationMatrixForAxis('z', heading.z);

      var rotationMatrix = rotationX.x(rotationY).x(rotationZ);

      var move = Sylvester.Vector.create([0, -distance, 0]);
      move = rotationMatrix.x(move);

      // this is where we are after drawing the pipe
      var newPosition = start.add(move);

      position = {
        x: newPosition.elements[0],
        y: newPosition.elements[1],
        z: newPosition.elements[2]
      };
    };

    var turnZ = function (by) {
      var newZRotation = heading.z + by;

      if (newZRotation > 360 || newZRotation < -360) {
        newZRotation = newZRotation % 360;
      }

      heading.z = newZRotation;
    };

    obj.turnLeft = function (by) {
      turnZ(-by);
    };

    obj.turnRight = function (by) {
      turnZ(by);
    };

    obj.setHeading = function () {
      if (arguments.length === 1) {
        heading = arguments[0];
      }
      else {
        heading = {x: arguments[0], y: arguments[1], z: arguments[2]};
      }
    };

    obj.setPosition = function () {
      if (arguments.length === 1) {
        position = arguments[0];
      }
      else {
        position = {x: arguments[0], y: arguments[1], z: arguments[2]};
      }
    };

    obj.storeState = function () {
      states.push({position: _.clone(position), heading: _.clone(heading)});
    };

    obj.restoreState = function () {
      var state = states.pop();
      obj.setPosition(state.position);
      obj.setHeading(state.heading);
    };

    obj.runSpec = function (spec) {
      stage.clear();

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

      // move turtle to starting position
      obj.setPosition(turtleStartState.position);
      obj.setHeading(turtleStartState.heading);

      // iterate the ruleset to get its output
      for (var i = 1; i <= spec.iterations; i++) {
        ruleset.step();
      }

      // use spec.commands to do the drawing
      for (var j = 0; j < ruleset.state.length; j++) {
        runCommand(j);
      }
    };

    return obj;
  };

});
