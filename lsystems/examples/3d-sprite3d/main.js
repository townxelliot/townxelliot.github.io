require(
[
  'lodash',
  'jq',
  'turtle-sprite3d',
  'lsystem-specs',
  'domReady!'
],
function (_, $, TurtleSprite3D, LsystemSpecs) {
  console.log('3D L-Systems demo loading');

  var drawingArea = document.getElementById('drawing-area');
  var turtle = TurtleSprite3D(drawingArea);

  // add options to drop-down
  _.each(LsystemSpecs, function (value, key) {
    var option = $('<option/>')
                 .attr('value', key)
                 .text(key);
    $('[name=lsystem-choice]').append(option);
  });

  // choose an option, run the spec
  $('[name=lsystem-choice]').change(function (e) {
    var choice = $(e.target).val();

    if (choice) {
      turtle.runSpec(LsystemSpecs[choice]);
    }
  });
});
