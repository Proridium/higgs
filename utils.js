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

module.exports.logging = {
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
   }