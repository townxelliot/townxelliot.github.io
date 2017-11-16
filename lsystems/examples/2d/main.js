require(
[
  'lsystem-specs',
  'super-turtle',
  'lodash',
  'jq',
  'domReady!'
],
function (LsystemSpecs, SuperTurtle, _, $) {
  console.log('2D L-Systems demo loading');

  var canvas = document.getElementById('turtle-me');
  var superTurtle = SuperTurtle(canvas);

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
      superTurtle.runSpec(LsystemSpecs[choice], 0);
    }
  });
});
