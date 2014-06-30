var exec = require('child_process').exec;
var fs = require('fs');

var styles = {
   // reset style: \x1B[10;22;23;24;25;27;28;29;54;55m
   // reset default color: \x1B[39m
   // reset all? \x1B[0m
   reset: '\x1B[10;22;23;24;25;27;28;29;54;55m\x1B[39m',
   underline: '\x1B[4m',
   bold: '\x1B[1m',
   red: '\x1B[31m',
   green: '\033[32m',
   grey: '\x1B[90m'
};

var log = {
   header: function (text) {
      console.log('\n\n' + styles.red + styles.bold + '   ' + styles.underline + text + styles.reset + '  \n');
   },
   subHeader: function (text) {
      console.log('   ' + styles.bold + text + styles.reset);
   },
   subHeader2: function (text) {
      console.log('      ' + styles.grey + text + styles.reset);
   },
   body: function (text) {
      console.log('      ' + styles.grey + text + styles.reset);
   },
   body2: function (text) {
      console.log('          ' + styles.grey + text + styles.reset);
   },
   red: function (text) {
      console.log(styles.red + text + styles.reset);
   },
   green: function (text) {
      console.log(styles.green + text + styles.reset);
   },
   grey: function (text) {
      console.log(styles.grey + text + styles.reset);
   }

};

log.header(' ~ Start Flux Template ~ ');

installNodeModules(installBowerModules);

function installNodeModules(cb) {
   log.subHeader('1) Installing node modules...');
   exec('npm install', function (error, stdout, stderr) {
//      if (stderr.length > 0) {
//         log.red('npm error: \n');
//         log.body(stderr);
//      }
      installLess(cb);
   });
}

function installLess(cb) {
   log.subHeader2('1a) Installing LESS Compiler globally...');
   exec('lessc -v', function (error, stdout, stderr) {
      if (stderr !== undefined && stderr.length > 0) {
         exec('npm install less -g', function (error, stdout, stderr) {
            //      if (stderr.length > 0) {
            //         log.red('LESS install error: \n');
            //         log.body2(stderr + '\n');
            //       }  else {
            log.body2('... completed successfully.\n');
            //      }
            ensureStyle(cb);
         });
      } else {
         log.body2('... already installed.\n');
         ensureStyle(cb);
      }
   });
}

function installBowerModules() {
   log.subHeader('2) Installing bower modules...');
   exec('cd src && bower install && cd ..', function (error, stdout, stderr) {
      if (stderr.length > 0) {
         log.red('bower error: \n');
         log.body(stderr + '\n');
      }  else {
         log.body('... completed successfully.\n');

         log.green('\n** Flux setup completed.\n\nDon\'t forget to setup the LESS File Watcher in WebStorm Preferences: Project Settings | File Watchers.\n\n');
      }
   });
}

function ensureStyle(cb) {
   log.subHeader2('1b) Ensuring styles...');
   var siteCss = path.join(__dirname, '/src/styles/site.css');
   if (!fs.existsSync(siteCss)) {
      log.body2('... site.css missing!');
      exec('lessc -x ./src/styles/site.less > ./src/styles/site.css', function (error, stdout, stderr) {
         if (stderr.length > 0) {
            log.red('LESS compilation error: \n');
            log.body2(stderr + '\n');
         } else {
            log.body2('... site.css created. ', stdout, stderr, '\n');
         }
         cb();
      });
   } else {
      log.body2('... site.css exists. :)\n');
      cb();
   }
}


