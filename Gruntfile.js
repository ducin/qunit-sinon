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
          // sinon.js
          'sinon': true,
          // radio.js
          'radio': true,
          // QUnit.js
          'test': true,
          'module': true,
          'equal': true,
          'ok': true,
          'throws': true
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
