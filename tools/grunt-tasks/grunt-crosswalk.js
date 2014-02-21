module.exports = function (grunt) {
  var path = require('path');
  var which = require('which');
  var fs = require('fs');
  var semver = require('semver');

  var Api = require('crosswalk-apk-generator');

  var generate_apk = function(data,done) {
    var outDir = data.outDir || '.';
    var appConfig = {};
    var envConfig = {};

    // copy user-supplied parameters into envConfig or appConfig
    var envProperties = Object.keys(Api.Env.CONFIG_DEFAULTS);
    Object.keys(data).forEach(function(property){
      if (envProperties.indexOf(property)!=-1) {
        envConfig[property] = data[property];
      } else {
        appConfig[property] = data[property];
      }
    });

    // automatically find androidSDKDir from 'android' command in PATH
    if (!envConfig.androidSDKDir) {
      var androidPath = which.sync('android');
      // up two directories
      envConfig.androidSDKDir = path.dirname(path.dirname(androidPath));
    }

    if (!envConfig.xwalkAndroidDir) {
      var fromEnvVar = process.env.XWALK_APP_TEMPLATE;
      if (fromEnvVar) {
        envConfig.xwalkAndroidDir = fromEnvVar;
      }
    }

    // determine arch from xwalkAndroidDir name
    // eg $HOME/Downloads/crosswalk-4.32.69.0-x86/xwalk_app_template
    if (!envConfig.arch && envConfig.xwalkAndroidDir) {
      var xwalkAndroidRoot = path.dirname(envConfig.xwalkAndroidDir);
      var pathBits = xwalkAndroidRoot.split(path.sep);
      if (path.sep=='\\' && pathBits.length==1) {
        // path is something like c:/bla/bla/bla, ie not using \
        // split with '/' instead
        pathBits = xwalkAndroidRoot.split('/');
      }
      var sdkName = pathBits[pathBits.length-1];
      var sdkNameBits = sdkName.split('-');

      envConfig.arch = sdkNameBits[sdkNameBits.length-1];
    }

    if (!envConfig.androidAPIVersion) {
      // get the api latest version from androidSDK/build-tools
      var buildToolsDir = path.join(envConfig.androidSDKDir,"build-tools");
      var files = fs.readdirSync(buildToolsDir);
      var androidAPIVersions = files.sort(semver.compare);
      var length = androidAPIVersions.length;
      var latest = androidAPIVersions[length-1];
      envConfig.androidAPIVersion = latest;
    }

    var logger = grunt.log;
    var commandRunner = Api.CommandRunner(data.verbose, logger);

    // create a promise for a configured Env object
    var envPromise = Api.Env(envConfig, {commandRunner: commandRunner});

    // create a promise for a configured App object
    var appPromise = Api.App(appConfig);

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
        var locations = Api.Locations(app.sanitisedName, app.pkg, env.arch, outDir);

        // run the build
        return env.build(app, locations);
      }
    )
    .done(
      // success
      function (finalApk) {
        grunt.log.writeln('\n*** DONE\n    output apk path is ' + finalApk);
        done();
      },

      // error handler
      function (err) {
        grunt.log.error('!!! ERROR');
        grunt.log.error(err.stack);
        done(false);
      }
    );
  };

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
  grunt.registerTask('crosswalk', 'Tasks for generating apk packages for crosswalk on Android', function (identifier) {
    var done = this.async();

    generate_apk(grunt.config('crosswalk'), done);
  });

};

