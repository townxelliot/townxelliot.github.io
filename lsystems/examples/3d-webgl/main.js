require(
[
  'lodash',
  'jq',
  'turtle-webgl',
  'lsystem-specs',
  'domReady!'
],
function (_, $, Turtle, LsystemSpecs) {
  console.log('3D WebGL L-Systems demo loading');

  // add options to drop-down
  _.each(LsystemSpecs, function (value, key) {
    var option = $('<option/>')
                 .attr('value', key)
                 .text(key);
    $('[name=lsystem-choice]').append(option);
  });

  var drawingArea = document.getElementById('drawing-area');
  var turtle = Turtle(drawingArea);

  // choose an option, run the spec
  $('[name=lsystem-choice]').change(function (e) {
    var choice = $(e.target).val();

    if (choice) {
      turtle.runSpec(LsystemSpecs[choice]);
    }
  });

   $('[name=lsystem-choice]').removeAttr('disabled');
});
