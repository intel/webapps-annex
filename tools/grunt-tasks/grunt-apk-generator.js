module.exports = function (grunt) {
  var path = require('path');

  // input the crosswalk-apk-generator API
  var Api = require('crosswalk-apk-generator');

  // the Q object is accessible from Api
  var Q = Api.Q;
  var logger = Api.ConsoleLogger();
  var ArchiveFetcher = Api.ArchiveFetcher;
  var VersionsFetcher = Api.VersionsFetcher;
  var Env = Api.Env;
  var App = Api.App;

  // options passed from the downloader to the generator
  var passthrough = {
    xwalkAndroidDir: '',
    arch: ''
  };

  var download_xwalk_android = function(data, done) {
    var archiveFetcher = ArchiveFetcher({logger: logger});

    // generic error handler
    var errorHandler = function (err) {
      logger.error(err.message);
      logger.error(err.stack);
      done(false);
    };

    // show parameters used for the fetch or query
    var showParams = function (params) {
      logger.log('  architecture = ' + params.arch);
      logger.log('  channel = ' + params.channel);

      if (params.version) {
        logger.log('  version = ' + params.version);
      }

      if (params.url) {
        logger.log('  url = ' + params.url);
      }
    };

    // derive the tarballName and outDir
    var tarballName = data.tarballName || 'xwalk_app_template.tar.gz';
    var outDir = data.outDir || '.';

    var paramsDfd = Q.defer();

    // work out what we're going to download

    var urlTemplate = data.urlTemplate ||
      'https://download.01.org/crosswalk/releases/android-' +
      '<%= arch %>/<%= channel %>/crosswalk-<%= version %>-<%= arch %>.zip';

    var params = {
      arch: data.arch || Env.CONFIG_DEFAULTS.arch,
      channel: data.channel || "beta",
      version: data.version
    };

    // URL is set as an option
    var archiveUrl = data.url;

    // no url option, but we've got the version, which is enough to build a URL
    if (!archiveUrl && params.version) {
      archiveUrl = _.template(urlTemplate, params);
    }

    // we already know the archiveUrl
    if (archiveUrl) {
      params.url = archiveUrl;
      paramsDfd.resolve(params);
    }
    // no version specified and no url option, so get the latest version,
    // based on arch and channel
    else {
      versionsFetcher = VersionsFetcher();
      versionsFetcher.getDownloads(params.arch, params.channel)
      .done(
        function (results) {
          params.version = results.files[0].version;
          params.url = results.files[0].url;
          return paramsDfd.resolve(params);
        },

        function (err) {
          logger.error('error while retrieving available versions');
          errorHandler(err);
        }
      );
    }

    paramsDfd.promise
    .then(
      function (params) {
        logger.log('fetching xwalk-android using parameters:');
        showParams(params);
        return archiveFetcher.fetch(params.url, tarballName, outDir);
      }
    )
    .done(
      function (xwalkAndroidDir) {
        logger.log('xwalk zip file and app template downloaded and unpacked successfully');
        logger.log('\nxwalkAndroidDir (xwalk_app_template directory inside ' +
                   'unpacked xwalk-android):\n' + xwalkAndroidDir);
        passthrough.arch = params.arch;
        passthrough.xwalkAndroidDir = xwalkAndroidDir;
        done();
      },

      errorHandler
    );
  };

  var generate_apk = function(data,done) {
    var outDir = data.outDir || '.';

    // use values from downloader, if none specified
    Object.keys(passthrough).forEach(function(property){
      data.envConfig[property] = data.envConfig[property] || passthrough[property];
    });

    // convert to full pathname
    outDir = path.resolve(outDir);

    // create a promise for a configured Env object
    var envPromise = Env(data.envConfig);

    // create a promise for a configured App object
    var appPromise = App(data.appConfig);

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
        console.log('\n*** DONE\n    output apk path is ' + finalApk);
        done();
      },

      // error handler
      function (err) {
        console.log('!!! ERROR');
        console.log(err.stack);
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
  grunt.registerMultiTask('apk_generator', 'Tasks for generating apk packages', function (identifier) {
    var done = this.async();

    if (this.target == 'generate_apk') {
      generate_apk(this.data, done);
    } else
    if (this.target == 'download_xwalk_android') {
      // support a list of targets, eg :
      //   apk_generator: {
      //     download_xwalk_android : {
      //       stable_x86: {
      //         "outDir": 'build',
      //         "channel": 'stable',
      //         "arch": 'x86'
      //       },
      //       stable_arm: {
      //         "outDir": 'build',
      //         "channel": 'stable',
      //       ... and so one
      //   
      // or just a single one :
      //   apk_generator: {
      //     download_xwalk_android : {
      //       "outDir": 'build',
      //       "channel": 'stable',
      //       "arch": 'x86'
      //     },
      //     ...
      var targetName = this.args[0];
      var data = (targetName)?this.data[targetName]:this.data;

      download_xwalk_android(data, done);
    }
  });

};

