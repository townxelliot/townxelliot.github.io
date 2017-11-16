module.exports = function (grunt) {

  /*
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  */
  grunt.loadTasks('tools/grunt-tasks');

  grunt.initConfig({
    packageInfo: grunt.file.readJSON('package.json'),

    /*
    clean: ['build'],

    requirejs: {
      compile: {
        options: {
          baseUrl: './src',

          // include the main requirejs configuration file;
          // see notes in that file on the allowed format
          mainConfigFile: './require-config',

          // main application module
          name: 'lsystem',

          // output
          out: 'build/lsystem.min.js',

          // we don't need to wrap the js in an anonymous function,
          // as our main.js runs the application
          wrap: false,

          uglify: {
            beautify: false,
            toplevel: true,
            ascii_only: true,
            no_mangle: false,
            max_line_length: 1000
          }
        }
      }
    },
    */

    jasmine_runner: {
      specsDir: 'test',
      useRequireJs: false // don't use true as it messes up because of uuid
    }
  });

  grunt.registerTask('default', ['jasmine_runner']);
};
