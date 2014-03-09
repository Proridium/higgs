module.exports = {
   cache: true,
   entry: [ "./controllers/MainCtrl.js", "./controllers/AboutCtrl.js", "./app.js" ],
   output: {
      path: __dirname,
      filename: "common.js"
   }
//   ,
//   module: {
//      loaders: [
//         { test: /\.css$/, loader: "style!css" }
//      ]
//   }
};