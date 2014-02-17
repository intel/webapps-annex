module.exports = function (grunt) {
  var path = require('path');

  // input the crosswalk-apk-generator API
  var Api = require('crosswalk-apk-generator');

  // the Q object is accessible from Api
  var Q = Api.Q;

  /**
  * Build an apk
  *
  * Deps: 
  *
  * Configuration options:
  *
  *   appName - the name of the application; used as the base filename
  *   outDir - output directory to put the zipfile into
  *   version - application version
  *
  */
  grunt.registerMultiTask('generate_apk', 'Generate an apk package', function (identifier) {

    var done = this.async();

    var outDir = this.data.outDir || '.';

    // convert to full pathname
    outDir = path.resolve(outDir);

    // create a promise for a configured Env object
    var envPromise = Api.Env(this.data.envConfig);

    // create a promise for a configured App object
    var appPromise = Api.App(this.data.appConfig);

    // use the Q promises library to synchronise the promises, so we
    // can create the objects in "parallel"
    Api.Q.all([envPromise, appPromise])
    .then(
      function (objects) {
        // once the App and Env are constructed, use the Env instance
        // to do a build for the App instance
        var env = objects[0];
        var app = objects[1];

        // create a Locations object for this App instance
        var locations = Api.Locations(app.sanitisedName, app.pkg, "x86", outDir);

        // show the finalised configuration
        console.log('OBJECTS:');
        console.log(objects);
        console.log('LOCATIONS:');
        console.log(locations);
        console.log('ENV CONFIGURATION:');
        console.log(env);
        console.log('APP CONFIGURATION:');
        console.log(app);

        // run the build
        return env.build(app, locations);
      }
    )
    .done(
      // success
      function (finalApk) {
        console.log('\n*** DONE\n    output apk path is ' + finalApk);
      },

      // error handler
      function (err) {
        console.log('!!! ERROR');
        console.log(err.stack);
      }
    );

  });

};

