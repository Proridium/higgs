module.exports = {
   cache: true,
   entry: [ "./controllers/MainCtrl.js", "./controllers/AboutCtrl.js", "./controllers/ProductsCtrl.js", "./controllers/ServicesCtrl.js", "./controllers/PartnersCtrl.js", "./app.js" ],
   output: {
      path: __dirname,
      filename: "../public/common.js"
   },
   plugins: [

   ]
//   ,
//   module: {
//      loaders: [
//         { test: /\.css$/, loader: "style!css" }
//      ]
//   }
};