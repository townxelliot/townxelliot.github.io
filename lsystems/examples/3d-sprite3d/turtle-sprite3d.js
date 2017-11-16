// a turtle (very minimal at best) in 3D using Sprite3D
// which draws "pipes"
//
// we maintain a "pen point" in 3d space, representing where the "pen"
// is at any point; to draw to another point, we work out where
// that point is, then draw a rectangle from the current pen
// position to the new pen position
define(['sprite3d', 'sylvester', 'lodash'], function (Sprite3D, Sylvester, _) {
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

  // drawingArea: selector result set to use for the Sprite3D drawing
  return function (drawingArea) {
    var obj = {};

    var stage = Sprite3D.stage(drawingArea);

    var drawingAreaWidth = $(drawingArea).width();
    var drawingAreaHeight = $(drawingArea).height();

    var states = [];

    var thickness = 2;
    var colour = '#0D0';
    var borderColour = 'red';
    var penIsDown = true;

    // in degrees
    var heading = { x: 0, y: 0, z: 45 };

    // in pixels relative to top-left corner of drawing area
    var position = { x: drawingAreaWidth / 2, y: drawingAreaHeight / 2, z: 0 };

    // draw a cuboid along the current heading with height distance
    obj.forward = function (distance) {
      if (penIsDown) {
        var cuboid = Sprite3D.box(thickness, distance, thickness);
        cuboid.origin(-thickness / 2, distance / 2, -thickness / 2);
        cuboid.transformOrigin(-thickness / 2, distance / 2, -thickness / 2);

        cuboid.position(position.x, position.y, position.z);
        cuboid.rotation(heading.x, heading.y, heading.z);

        $(cuboid).find('*').css({
          'box-sizing': 'border-box',
          'background-color': colour,
          'border-top': '1px solid ' + borderColour
        });

        $(cuboid).addClass('cuboid');
        stage.appendChild(cuboid);
      }

      // get the position for the centre of the tip of the cuboid
      var start = Sylvester.Vector.create([position.x, position.y, position.z]);

      var rotationX = getRotationMatrixForAxis('x', heading.x);
      var rotationY = getRotationMatrixForAxis('y', heading.y);
      var rotationZ = getRotationMatrixForAxis('z', heading.z);

      var rotationMatrix = rotationX.x(rotationY).x(rotationZ);

      var move = Sylvester.Vector.create([0, -distance, 0]);
      move = rotationMatrix.x(move);

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
      $(stage).find('.cuboid').remove();

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

      var sprites = $(stage).find('.cuboid')
      console.log('Sprites added: ' + sprites.length +
                  '; NB this equates to ' + (7 * sprites.length) +
                  ' DOM elements (7 per sprite)');
      sprites.each(function () { this.update() });
    };

    return obj;
  };

});
