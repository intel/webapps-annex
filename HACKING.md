# INITIAL SET UP

To run the build, you'll need to install some node modules.
Run the following in the top-level directory of the project:

    npm install

grunt requires that you install grunt-cli globally
to be able to use grunt from the command line. To install
grunt-cli do:

    npm install -g grunt-cli

You should then install the client-side dependencies into app/lib/:

  npm install -g bower
  bower install

Note that if you want to install the application to a Tizen device
as a wgt file, you will also need to install the sdb tool first.
This is available for various platforms from
http://download.tizen.org/tools/latest-release/.

Configure your package manager to use the appropriate repo from the
ones available and install sdb, e.g. for Fedora 17:

    $ REPO=http://download.tizen.org/tools/latest-release/Fedora_17/tools.repo
    $ sudo yum-config-manager --add-repo $REPO
    $ sudo yum install sdb

# WHERE'S THE APP?

There are a few options for running the application:

*   Open app/index.html in a browser (there's no requirement to
    run a build before you can run the app).

*   Serve the app from a standard web server. First, run:

        grunt dist

    Then copy the content of the build/app/ directory to a web folder
    for your server (e.g. an Apache htdocs directory).

*   Run the app using the built-in local server:

        grunt server

    This builds the dist version of the app and runs it on a server
    accessible at http://localhost:30303/. This is useful for testing the
    app in a mobile device: just navigate to the server hosting
    the app, using the phone's browser.

*   Install/reinstall to an attached Tizen device via sdb by running:

        grunt wgt-install

    This installs an optimised version of the app (minified HTML,
    minified and concatenated CSS and JS).

*   Install an SDK-specific version of the app (no minification or
    concatenation) with:

        grunt sdk-install

*   Build the files for the Chrome extension with:

        grunt crx

    then load the build/crx directory as an unpacked extension in Chrome
    developer mode. (The build can't currently make full .crx packages.)

# PACKAGING

To sign the app, grunt needs to know the location of your Tizen SDK
Profile xml file. This is set to default to :

  test:$HOME/tizen-sdk/tools/ide/sample/profiles.xml

which is the default location according to the Tizen CLI SDK instructions
for generating the certificates.

<https://developer.tizen.org/help/index.jsp?topic=%2Forg.tizen.web.appprogramming%2Fhtml%2Fide_sdk_tools%2Fcommand_line_interface.htm>

You can override this path using the TIZENSDKPROFILE environment
variable. For example, if you moved the sdk from ~/tizen-sdk to
~/apps/tizen-sdk :

  export TIZENSDKPROFILE=test:$HOME/apps/tizen-sdk/tools/ide/sample/profiles.xml

The application can be packaged into a wgt (zip) file using the grunt
command:

    grunt wgt

This will generate a package in the build/ directory.

It can also be packaged into an SDK wgt file (with uncompressed JS,
CSS, and HTML) using:

    grunt sdk

Note that in both cases, the files comprising the packages are
first copied into the build/wgt and build/sdk directories respectively.

To create packages for Android use the 'apk' target:

    grunt apk

This will first build an 'xpk' target and then package two apks in
build/ named AppName_{x86,arm}.apk.
You can then install the appropriate one to your device as usual -
for example, ```adb install -r build/AppName_x86.apk```.
There are also targets to create packages just for a single architecture. They require the 'xpk' target to be build previously :

    grunt xpk
    grunt crosswalk:x86

or :

    grunt xpk
    grunt crosswalk:arm

Packaging for Android requires some set up - please see
[crosswalk-apk-generator README.md](https://github.com/crosswalk-project/crosswalk-apk-generator/blob/master/README.md#pre-requisites).

# GUIDE FOR MS WINDOWS USERS AND TIZEN IDE

Here are some steps to help people wishing to generate code for use in the Tizen IDE on Microsoft Windows.

1. install git
1. get admin shell
1. click start
1. in ‘search’ type ‘command’ - don’t hit return/enter
1. ‘command prompt’ appears under ‘programs’ - right click on it and select ‘run as administrator’ - click ‘yes’ if it asks for confirmation
1. install grunt - type ‘npm install -g grunt’
1. install bower - type ‘npm install -g bower’
1. close admin shell
1. right click on desktop and select ‘git bash’
1. change directory to where you want your projects to go (or don’t, if Desktop is ok)
1. clone the repository, eg ‘git clone https://github.com/01org/webapps-annex.git’
1. cd webapps-annex
1. npm install
1. bower install
1. grunt sdk
1. the project is now built in build/sdk and can be imported into the IDE
1. launch Tizen IDE
1. File->New->Tizen Web Project
1. select all the files in the project and delete them
1. File->Import…->General->File System Next
1. “From directory” <- the build/sdk directory
1. “Into folder” <- the project you created in the IDE
1. Finish

# Example usage on Linux

```
[webapps-annex]$ !npm
npm install && bower install && grunt apk && grunt crosswalk
npm WARN deprecated lodash@1.1.1: lodash@<2.0.0 is no longer maintained. Upgrade to lodash@^3.0.0
...
└── jpegtran-bin@0.1.7 (which@1.0.9, colors@0.6.2, mocha@1.9.0, request@2.16.6, tar@0.1.20)
bower wqy-microhei#*            cached 
...
wqy-microhei#e-tag:4a1ae24c- app/lib/wqy-microhei
Running "clean:0" (clean) task

Running "imagemin:dist" (imagemin) task
✔ app/images/winner_001_wood.jpg (saved 5.16Kb)
✔ app/images/result_quit.png (saved 2.86KB)
✔ app/images/opening_001_bg.jpg (saved 2.19KB)
✔ app/images/game_015_pcside.png (saved 2.76KB)
✔ app/images/game_014_board.png (saved 2.81KB)
✔ app/images/game_013_settingsarrow.png (saved 3.17KB)
✔ app/images/game_012_settingsexit_img.png (saved 2.73KB)
✔ app/images/game_012_settingsexit.png (saved 3.30KB)
✔ app/images/game_011_settings1p_img.png (saved 2.93KB)
✔ app/images/game_011_settings1p.png (saved 3.73KB)
✔ app/images/game_010_settings2p_img.png (saved 3.06KB)
✔ app/images/game_010_settings2p.png (saved 3.78KB)
✔ app/images/game_009_settingsrules_img.png (saved 2.81KB)
✔ app/images/game_009_settingsrules.png (saved 3.46KB)
✔ app/images/game_008_settingsstartover_img.png (saved 2.77KB)
✔ app/images/game_008_settingsstartover.png (saved 3.41KB)
✔ app/images/game_007_settingsbtnrollover.png (saved 3.19KB)
✔ app/images/game_006_settingsbtn.png (saved 3.30KB)
✔ app/images/game_005_pcrightside.png (saved 3.17KB)
✔ app/images/game_004_pcleftside.png (saved 3.17KB)
✔ app/images/game_003_whitepc.png (saved 3.44KB)
✔ app/images/game_002_blackpc.png (saved 3.17KB)
✔ app/images/game_001_boardbg.jpg (saved 9.15KB)
✔ app/images/winner_003_p2win.jpg (saved 1.05KB)
✔ app/images/winner_002_p1win.jpg (saved 1.00KB)
✔ app/images/rules_001_bg.jpg (saved 2.54KB)
✔ app/images/opening_003_rollover.png (saved 5.54KB)
✔ app/images/rules_002_rollover.png (saved 5.31KB)
✔ app/images/winner_005_exitrollover.png (saved 4.74KB)
✔ app/images/winner_004_rollover.png (saved 5.68KB)
✔ app/images/opening_002_title.png (saved 9.33KB)

Running "uglify:dist" (uglify) task
File "build/app/js/annex.js" created.
File "build/app/js/scaleBody.js" created.

Running "cssmin:dist" (cssmin) task
File build/app/css/annex.css created.
File build/app/css/i18n.css created.

Running "htmlmin:dist" (htmlmin) task
File build/app/index.html created.

Running "copy:common" (copy) task
Created 21 directories, copied 303 files

Running "copy:apk" (copy) task
Created 25 directories, copied 342 files

Running "copy:apk_manifest" (copy) task
Copied 1 files

Done, without errors.
Running "crosswalk:default" (crosswalk) task
  Packaging /home/davidmaxwaterman/z/webapps/webapps-annex/build/apk
  Checking host setup
  + Checking host setup for target android
  + Checking for android... /opt/android-sdk-linux/tools/android
  + Checking for ant... /usr/bin/ant
  + Checking for java... /usr/bin/java
  + Checking for lzma... /usr/bin/lzma
  + Checking for ANDROID_HOME... /opt/android-sdk-linux
  + Testing dummy project in /tmp/ossYcJ
  + Creating com.example.foo [done] 
  + Building com.example.foo [done] 
  Initializing build dir /tmp/SIb5DF
  + Copying app template from ...node_modules/crosswalk-app-tools/app-template
  + Loading 'android' platform backend
  + Building against API level android-21
  + Creating org.org01.webapps.annex [done] 
  + Defaulting to download channel stable
  + Looking for latest version in crosswalk/stable
  + Fetching 'stable' versions index [##########] 
  + Found version '16.45.421.19' in channel 'stable'
  + Using cached ...maxwaterman/z/webapps/crosswalk/crosswalk-16.45.421.19.zip
  + Extracting .../z/webapps/crosswalk/crosswalk-16.45.421.19.zip [##########] 
  + Project template created at .../SIb5DF/org.org01.webapps.annex/prj/android
  Importing web application
  + Source /home/davidmaxwaterman/z/webapps/webapps-annex/build/apk
  + Destination /tmp/SIb5DF/org.org01.webapps.annex/app
  Building packages armeabi-v7a,x86
  + Loading 'android' platform backend
  + Adding permissions ACCESS_NETWORK_STATE,ACCESS_WIFI_STATE,INTERNET
  + Updating java activity for 'debug' configuration
  + Copying app to /tmp/SIb5DF/org.org01.webapps.annex/prj/android/assets/www
  + Updating theme.xml for display mode (fullscreen: no)
  + Using android:versionCode '20000010'
  + Building armeabi-v7a [done] 
  + Using android:versionCode '60000010'
  + Building x86 [done] 
  Package: org.org01.webapps.annex-0.0.10-debug.armeabi-v7a.apk
  Package: org.org01.webapps.annex-0.0.10-debug.x86.apk
  + Deleting build dir /tmp/SIb5DF
[webapps-annex]$ ls
app         build         HACKING.md    icon_16.png  LICENSE       org.org01.webapps.annex-0.0.10-debug.armeabi-v7a.apk  package.json  README.md
bower.json  Gruntfile.js  icon_128.png  icon_48.png  node_modules  org.org01.webapps.annex-0.0.10-debug.x86.apk          platforms     tools
[webapps-annex]$ 
```
