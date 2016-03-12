Higgs
==============
# Table of Contents
1. [Setup for Brand NEW Machines](#Setup-for-Brand-NEW-Machines)
2. [Editor Setup](#Editor-Setup)
  - [Visual Studio Code](##Visual-Studio-Code)
  - [WebStorm](##WebStorm)
3. [Start the Site](#Start-the-Site)
4. [Miscellany](#Miscellany)

#Setup for Brand NEW Machines
1. <b>Install NodeJS v5.8+</b> for your platform: 
 - Windows and Mac: <a href='https://nodejs.org/en/download/stable/'>Download</a> and install it.
 - Linux:
    - <b>curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -</b>
    - <b>sudo apt-get install -y nodejs</b>
 - Confirm that it is installed property:  <b>node --version</b>
    
2. <b>Server</b>: We use <a href='https://github.com/indexzero/http-server'>http-server</a> to serve our static files, and gulp for building a distributable app.
  - Install Gulp Globally
    - <b>npm install -g gulp</b>
  - Install http-server Globally from a terminal / command line
    - <b>npm install -g http-server</b>

3. <b>Source Control</b>: We use a  <a href='http://git-scm.com/'>git</a>
	- Download <a href='https://git-scm.com/downloads'>Git</a> and install it.
	- Confirm that it is installed property. 
		<pre><code>git --version</code></pre>
  - Optional: Install a Git Client on your desktop
		- GitHub for <a href='https://windows.github.com/'>Windows</a> or <a href='https://mac.github.com/'>Mac</a>
		- Git <a href='http://www.git-tower.com/'>Tower2 for Mac</a>
		- <a href='http://www.sourcetreeapp.com/'>SourceTree</a> for Windows, Mac or Linux
    - <a href='http://www.gitkraken.com/'>GitKraken</a> for Windows, Mac or Linux
  
4. <b>Source Control Host</b>: We use <a href='https://github.com/'>GitHub</a> to host our files in a private repository.
	- Create a <a href='https://github.com/'>GitHub</a> account if you do not already have one.
	- Use <a href='https://help.github.com/articles/about-two-factor-authentication/'>Two-Factor authentication</a>

5. <b>Team Chat</b>: We use <a href='https://slack.com/'>Slack</a> for team chat.
- Create a <a href='https://slack.com/'>Slack</a> account
 - Install <a href='https://slack.com/downloads'>Slack</a> for Windows, Mac, Linux, iOS, Android or Windows Phone.
 
6. <b>Request Permissions</b>:
	- Send your <b>GitHub</b> & <b>slack</b> account login names to me: shartzog@gmail.com so I can add you to the team.
  
7. <b>Prepare the Code for Dev</b>: Start with our default project template and add it to your github account.
	- Wait for my email saying you have access to our source on GitHub
	- Clone <a href='https://github.com/Proridium/higgs'>this repo</a> on github
  - Run <b>npm install</b> on the repo to get all dependencies

8. <b>Shared Workspace</b> (& Notifications):
	- Slack Workspace: <https://proridium.slack.com/>
	- Install the appropriate client for build notifications (Mac [<a href='https://itunes.apple.com/us/app/slack/id803453959?mt=12'>iTunes</a> or <a href='http://slack.com/ssb/download-osx'>Direct</a>], <a href='https://chrome.google.com/webstore/detail/slack/jeogkiiogjbmhklcnbgkdcjoioegiknm?hl=en-US'>Chrome</a>, <a href='https://play.google.com/store/apps/details?id=com.Slack&hl=en'>Android</a> & <a href='https://itunes.apple.com/us/app/slack-team-communication/id618783545?mt=8'>iOS</a>)

9. <b>Dev Environment</b>:
  - <a href='http://code.visualstudio.com/download/'>Visual Studio Code</a> (free)
  - <a href='https://www.sublimetext.com/3'>Sublime 3 beta</a> ($70)
  - <a href='https://www.jetbrains.com/webstorm/download/'>WebStorm</a> ($129/yr)
  

#Editor Setup
##Visual Studio Code:
  - Install EditorConfig:
    <pre><code>> ext install editorconfig</pre></code>

##WebStorm:
  - Enable EditorConfig: <pre><code>File|Preferences, Editor, Check Enable external editorconfig</code></pre>
  - Enable tslint config
  - <a href='https://www.jetbrains.com/webstorm/webhelp/using-github-integration.html'>Configure</a> WebStorm for use with GitHub.
  - <a href='https://www.jetbrains.com/webstorm/webhelp/installing-updating-and-uninstalling-repository-plugins.html'>Enable the GitHub bundled plugin</a> to get access to GitHub integration.
  - <a href='https://www.jetbrains.com/webstorm/webhelp/registering-github-account-in-webstorm.html'>Register your GitHub account</a> in WebStorm.

<!-- #Build Commands (Terminal):

    gulp          // The default gulp command builds the dev files, then browserify's them into a single concatenated file.
    gulp build    // This will build the production files, then minimize, then browserify the files.
    gulp serve    // This will spin up the node instance with live-reloading of changes directly in the browser with watchers to rebuild files if anything changes.
-->

#Start the Site
1. Change directory to the repo folder on your machine.
2. Start the server: <b>http-server -o -c-1</b>

#Miscellany
* <b>Styles</b>: We will use Bootstrap's SASS source for our boilerplate, with SASS to be built out of our styles folder (with <a href='https://github.com/dlmanning/gulp-sass'>gulp-sass</a>)
* <b>Folder Structure</b>:
	- dist (future): The build version of the site that is served to the browser.
	- src: The source version of the site where development is done.
	- node_modules, jspm_modules: 3rd party dependency folders.
* <b>Agile Board</b>: <a href='https://github.com/proridium/higgs/issues'>GitHub Issues</a> (which is just a simple list of features and bugs).
* <b>Build</b>: We will use gulp as our build system.
* <b>Tests</b>: We will use mocha and chai for our unit tests.
* <b>Hosting</b>: TBD
* <b>Process to go to staging</b>:<br/>
	1. <a href='https://codeship.io/projects/25616'>Codeship.io</a> continuously monitors our github repo.
	2. If changes are detected, it runs our test suite (coming soon).
	3. If all tests pass, it pushes changes to our site (TBD <!-- <http://proridium.nodejitsu.com/> -->).
	4. Once a build is completed by Codeship.io, slack will send you a notification.
