Higgs
==============

![Codeship Build Status](https://codeship.com/projects/45f97ca0-e487-0131-f05a-5211e4dcf742/status?branch=master)

# Table of Contents
1. [Setup for Brand NEW Machines](#setup)
2. [Editor Setup](#editor)
  - [Visual Studio Code](#editor-vscode)
  - [WebStorm](#editor-webstorm)
3. [Start the Site](#start)
4. [Start with Electron](#electron)
5. [Miscellany](#misc)

# Setup for Brand NEW Machines<a name="setup"></a>
1. **Install NodeJS v5.8+** for your platform: 
 - Windows and Mac: <a href='https://nodejs.org/en/download/stable/'>Download</a> and install it.
 - Linux:
 ```shell
    curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
    sudo apt-get install -y nodejs
 ```
  
 - Confirm that it is installed property:
 ```shell
    node --version        // Should be >= 5.8.0
 ```

2. **Source Control**: We use <a href='http://git-scm.com/'>git</a>.
	- Download <a href='https://git-scm.com/downloads'>Git</a> and install it.
	- Confirm that it is installed property. 
	```shell
     git --version
  ```
  > **Optional**: Install a Git Client on your desktop
		 - GitHub for <a href="https://windows.github.com/">Windows</a> or <a href='https://mac.github.com/'>Mac</a>
		 - Git <a href='http://www.git-tower.com/'>Tower2 for Mac</a>
		 - <a href='http://www.sourcetreeapp.com/'>SourceTree</a> for Windows, Mac or Linux
         - <a href='http://www.gitkraken.com/'>GitKraken</a> for Windows, Mac or Linux
      
3. **Source Control Host**: We use <a href='https://github.com/'>GitHub</a> to host our files in a private repository.
	- Create a <a href='https://github.com/'>GitHub</a> account if you do not already have one.
	- Use <a href='https://help.github.com/articles/about-two-factor-authentication/'>Two-Factor authentication</a>

4. **Team Chat**: We use <a href='https://slack.com/'>Slack</a> for team chat.
  - Create a <a href='https://slack.com/'>Slack</a> account
  - Install <a href='https://slack.com/downloads'>Slack</a> for Windows, Mac, Linux, iOS, Android or Windows Phone.
  <!-- 5. **Team Chat**: We use Github's<a href='https://gitter.im'>gitter</a> for team chat.
    - Uses our github accounts, app is electron based just like slack.
    - Install <a href='https://gitter.im/apps'>gitter</a> for Windows, Mac, Linux, iOS or Android.
  -->

5. **Request Permissions**:
	- Send your **GitHub** & **slack** account login names to me: shartzog@gmail.com so I can add you to the team.
  
6. **Prepare the Code for Dev**: Start with our default project template and add it to your github account.
	- Wait for my email saying you have access to our source on GitHub
	- Clone <a href='https://github.com/Proridium/higgs'>this repo</a> on github
  
  - Run the following commands:
  ```shell
    npm install           // init npm
    npm install -g gulp   // install gulp globally
    jspm install -y       // init jspm
    gulp build            // build the app
  ```

7. <b>Shared Workspace</b> (& Notifications):
	- Slack Workspace: <https://proridium.slack.com/>
	- Install the appropriate client for build notifications (Mac [<a href='https://itunes.apple.com/us/app/slack/id803453959?mt=12'>iTunes</a> or <a href='http://slack.com/ssb/download-osx'>Direct</a>], <a href='https://chrome.google.com/webstore/detail/slack/jeogkiiogjbmhklcnbgkdcjoioegiknm?hl=en-US'>Chrome</a>, <a href='https://play.google.com/store/apps/details?id=com.Slack&hl=en'>Android</a> & <a href='https://itunes.apple.com/us/app/slack-team-communication/id618783545?mt=8'>iOS</a>)

8. <b>Dev Environment</b>:
  - <a href='http://code.visualstudio.com/download/'>Visual Studio Code</a> (free)
  - <a href='https://www.sublimetext.com/3'>Sublime 3 beta</a> ($70)
  - <a href='https://www.jetbrains.com/webstorm/download/'>WebStorm</a> ($129/yr)
  

#Editor Setup<a name="editor"></a>
##Visual Studio Code:<a name="editor-vscode"></a>
  - Install EditorConfig:
  ```shell
    > ext install editorconfig
  ```

##WebStorm:<a name="editor-webstorm"></a>
  - Enable EditorConfig: <pre><code>File|Preferences, Editor, Check Enable external editorconfig</code></pre>
  - Enable tslint config
  - <a href='https://www.jetbrains.com/webstorm/webhelp/using-github-integration.html'>Configure</a> WebStorm for use with GitHub.
  - <a href='https://www.jetbrains.com/webstorm/webhelp/installing-updating-and-uninstalling-repository-plugins.html'>Enable the GitHub bundled plugin</a> to get access to GitHub integration.
  - <a href='https://www.jetbrains.com/webstorm/webhelp/registering-github-account-in-webstorm.html'>Register your GitHub account</a> in WebStorm.

#Start the Site<a name="start"></a>
1. Change directory to the repo folder on your machine.
2. Start the server:
   ```shell
      gulp build            // build the app
      gulp watch            // start the site @ 127.0.0.1:9000
   ```

# Running The App under Electron<a name="electron">

To run the app under [Electron](http://electron.atom.io), follow these steps.

1. Install [Electron](http://electron.atom.io)

  ```shell
  npm install electron-prebuilt -g
  ```
2. To start the app, execute the following command:

  ```shell
  electron index.js
  ```
>**Note:** If you use electron every time or are packaging and so-forth, Then change this line in package.json from
`"main": "dist/main.js",` to `"main": "index.js",`
Build the app (this will give you a dist directory)
```shell
gulp build
```
To start the app, execute the following command:
```shell
   electron .
```

# Bundling<a name="bundling"></a>

Bundling is performed by [Aurelia Bundler](http://github.com/aurelia/bundler). A gulp task is already configured for that. Use the following command to bundle the app:

  ```shell
    gulp bundle
  ```

You can also unbundle using the command bellow:

  ```shell
  gulp unbundle
  ```

To start the bundled app, execute the following command:

  ```shell
    gulp serve-bundle
  ```
#### Configuration

The configuration is done by ```bundles.js``` file.

##### Optional
Under ```options``` of ```dist/aurelia``` add ```rev: true``` to add bundle file revision/version.



#Miscellany<a name="misc"></a>
* **Styles**: We will use Bootstrap's SASS source for our boilerplate, with SASS to be built out of our styles folder (with <a href='https://github.com/dlmanning/gulp-sass'>gulp-sass</a>)
* **Folder Structure**:
	- dist (future): The build version of the site that is served to the browser.
	- src: The source version of the site where development is done.
	- node_modules, jspm_modules: 3rd party dependency folders.
  - typings, custom_typings: typescript definitions.
  - build: Our gulp tasks.
* **Agile Board**: <a href='https://github.com/proridium/higgs/issues'>GitHub Issues</a> (which is just a simple list of features and bugs).
* **Hosting**: TBD
* **Process to go to staging**:
	1. <a href='https://codeship.io/projects/25616'>Codeship.io</a> continuously monitors our github repo.
	2. If changes are detected, it runs our test suite (coming soon).
	3. If all tests pass, it pushes changes to our site (TBD <!-- <http://proridium.nodejitsu.com/> -->).
	4. Once a build is completed by Codeship.io, slack will send you a notification.
