/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          // browser
          'console': true,
          // QUnit.js
          'test': true,
          'module': true,
          'ok': true,
          'equal': true,
          'deepEqual': true,
          'throws': true,
          // other 3rd party libraries
          'sinon': true,
          'radio': true,
          '_': true,
          'Backbone': true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['tests.js']
      }
    },
    qunit: {
      files: ['index.html']
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task.
  grunt.registerTask('test', ['qunit', 'jshint']);
  grunt.registerTask('default', ['test']);
};
