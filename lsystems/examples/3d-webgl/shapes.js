// simple constructors for threejs
define(['threejs'], function (THREE) {

  // colour: hex colour, e.g. 0x000000 == black
  var ClosedCylinder = function (radius, height, colour, position, rotation) {
    var radiusSegments = 10;
    var heightSegments = 10;
    var openEnded = false;

    var geometry = new THREE.CylinderGeometry(
      radius, // top
      radius, // bottom
      height,
      radiusSegments,
      heightSegments,
      openEnded
    );

    var material = new THREE.MeshPhongMaterial({color: colour});
    var shape = new THREE.Mesh(geometry, material);
    shape.castShadow = true;
    shape.receiveShadow = true;

    var newPosition = new THREE.Vector3(position.x, position.y, position.z);

    var factor = Math.PI / 180;

    var newRotation = new THREE.Vector3(
      rotation.x * factor,
      rotation.y * factor,
      rotation.z * factor
    );

    shape.position = newPosition;
    shape.rotation = newRotation;

    return shape;
  };

  var Stage = function (width, height) {
    var obj = {};

    var shapes = [];

    var scene = new THREE.Scene();

    var light = new THREE.SpotLight();
    light.position.set(0, 400, 400);
    light.castShadow = true;
    scene.add(light);

    var camera = new THREE.PerspectiveCamera(90, 1, 1, 10000);
    camera.position.x = 100;
    camera.position.z = 500;

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.shadowMapEnabled = true;

    // public API
    obj.elt = renderer.domElement;

    obj.addShape = function (shape) {
      shapes.push(shape);
      scene.add(shape);
    };

    obj.render = function () {
      var loop = function () {
        renderer.render(scene, camera);
        requestAnimationFrame(loop);
      };

      loop();
    };

    obj.clear = function () {
      shapes.forEach(function (shape) {
        scene.remove(shape);
      });

      shapes = [];
    };

    return obj;
  };

  return {
    Stage: Stage,
    ClosedCylinder: ClosedCylinder
  }

});
