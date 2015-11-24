Higgs
==============

[ ![Codeship Status for Proridium/web](https://www.codeship.io/projects/45f97ca0-e487-0131-f05a-5211e4dcf742/status)](https://www.codeship.io/projects/25616)

##Setup for Brand NEW Machines
1. <b>Shared Workspace</b> (& Notifications):
	- Create a <a href='https://slack.com/'>Slack</a> account
	- Slack Workspace: <https://proridium.slack.com/>
	- Install the appropriate client for build notifications (Mac [<a href='https://itunes.apple.com/us/app/slack/id803453959?mt=12'>iTunes</a> or <a href='http://slack.com/ssb/download-osx'>Direct</a>], <a href='https://chrome.google.com/webstore/detail/slack/jeogkiiogjbmhklcnbgkdcjoioegiknm?hl=en-US'>Chrome</a>, <a href='https://play.google.com/store/apps/details?id=com.Slack&hl=en'>Android</a> & <a href='https://itunes.apple.com/us/app/slack-team-communication/id618783545?mt=8'>iOS</a>)
2. <b>Server</b>: We use <a href='http://nodejs.org/'>NodeJS</a>.
	- <a href='http://nodejs.org/download/'>Download</a> and install it. Please make sure it is in the path.
	- Confirm that it is installed property.
		<pre><code>node --version</code></pre>

3. <b>Local Source Control</b>: We use a  <a href='http://git-scm.com/'>git</a>
	- Download <a href='http://git-scm.com/downloads'>Git</a> and install it.
	- Confirm that it is installed property.
		<pre><code>git --version</code></pre>
	- Follow the <a href='https://help.github.com/articles/set-up-git/'>setup</a> instructions.
4. <b>Source Control Host</b>: We use <a href='https://github.com/'>GitHub</a> to host our files in a private repository.
	- Create a <a href='https://github.com/'>GitHub</a> account if you do not already have one.
	- Use <a href='	- https://help.github.com/articles/about-two-factor-authentication/'>Two-Factor authentication</a>
5. <b>Tying Local & Remote Source Control</b>:
	- <a href='https://help.github.com/articles/set-up-git'>Setup your local git</a> installation for use with GitHub
		- including <a href='https://help.github.com/articles/set-up-git#next-steps-authenticating-with-github-from-git'>authentication</a>
	- Optional: Install a Git Client on your desktop
		- <a href='https://mac.github.com/'>GitHub for Mac</a>
		- <a href='https://windows.github.com/'>GitHub for Windows</a>
		- <a href='http://www.git-tower.com/'>Tower2 for Mac</a> *I use this one.
		- <a href='http://www.sourcetreeapp.com/'>SourceTree</a> for Windows or Mac
6. <b>Get Permissions</b>:
	- Send your GitHub & slack account login names to me: shartzog@gmail.com so I can add you to the team.
7. <b>Prepare the Code for Dev</b>: Start with our default project template and add it to your github account.
	- Wait for my email saying you have access to our source on GitHub
	- Open the <a href='https://github.com/proridium/web'>template repo</a> on github
	- <a href='https://help.github.com/articles/fork-a-repo/'>Fork</a> it
8. <b>Dev Environment</b>: <a href='https://www.jetbrains.com/webstorm/download/'>Install</a> WebStorm

##Project Setup (Terminal):
1. <b>npm init</b>: This will install all of the node package requirements, then install/download the client dependencies with bower.
2. <b>npm start</b>: This should install: Express, Gulp, JSPM, SystemJS, etc. This will then run the <b>gulp init</b> command for you.
3. <b>jspm install</b>: This should install Aurelia, Bootstrap, etc.
** <b>npm run bump</b>: This will bump the patch version up a number.

##WebStorm Setup:
1. <b>Configure a Node.js App</b> (<a href='http://blog.jetbrains.com/webstorm/2014/05/guide-to-node-js-development-with-webstorm/'>Guide to Node.js Development with WebStorm</a>):
	- <a href='https://www.jetbrains.com/webstorm/webhelp/running-and-debugging-node-js.html#Node.js_run'>Create a node Configuration</a>
2. <b>Get the Code</b>:
	- <a href='https://www.jetbrains.com/webstorm/webhelp/using-github-integration.html'>Configure</a> WebStorm for use with GitHub.
	- <a href='https://www.jetbrains.com/webstorm/webhelp/installing-updating-and-uninstalling-repository-plugins.html'>Enable the GitHub bundled plugin</a> to get access to GitHub integration.
	- <a href='https://www.jetbrains.com/webstorm/webhelp/registering-github-account-in-webstorm.html'>Register your GitHub account</a> in WebStorm.
	- <a href='https://www.jetbrains.com/webstorm/webhelp/cloning-a-repository-from-github.html'>Clone your GitHub forked repo</a> of the web repo.

##Build Commands (Terminal):

    gulp          // The default gulp command builds the dev files, then browserify's them into a single concatenated file.
    gulp build    // This will build the production files (transpile ES2015), then copy to the dist folder.
    gulp serve    // This will spin up the node instance with live-reloading of changes directly in the browser with watchers to rebuild files if anything changes.

##Miscellany
* <b>Styles</b>: We currently use LESS for our styles, and Bootstrap's LESS source for our boilerplate. The LESS files are in the src folder, and the outputed CSS is in the public folder.
	- Future possibility of SASS (with <a href='https://github.com/dlmanning/gulp-sass'>gulp-sass</a>)
* <b>Folder Structure</b>:
	- public: The build version of the site that is served to the browser.
		- bundle.js: The browserify output bundle of all app code for the client (excluding 3rd party libraries)
	- src: The source version of the site where development is done.
	- bower_components: Client dependency source folder.
	- node_modules: Server dependency source folder.
* <b>Agile Board</b>: We've tried a few, including <a href='https://www.jetbrains.com/youtrack/'>YouTrack</a> and <a href='https://trello.com/'>Trello</a>... but are currently using <a href='https://github.com/proridium/web/issues'>GitHub Issues</a> (which is just a simple list of features and bugs).
* <b>Build</b>: We use gulp as our build system, and browserify to bundle our modules up for easy client consumption.
* <b>Tests</b>: We will use <a href='http://www.seleniumhq.org/'>Selenium</a> for our testing.
* <b>Hosting</b>: We have no host right now.
* <b>Process to go to staging</b>:<br/>
	1. <a href='https://codeship.io/projects/25616'>Codeship.io</a> continuously monitors our github repo.
	2. If changes are detected, it runs our test suite (coming soon).
	3. If all tests pass, it will push the changes to our host (once selected).
	4. Once a build is completed by Codeship.io, slack will send you a notification.
