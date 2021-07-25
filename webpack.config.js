const path = require("path");
const srcPath = path.resolve(__dirname, "./src");
const pubPath = path.resolve(__dirname, "./public");
const globule = require("globule");
const HtmlWebpackPlugin = require("html-webpack-plugin");

//pug-----------
const pugArray = [];
const pugFiles = globule.find(srcPath + "/**/*.pug", {
  ignore: [srcPath + "/**/_*.pug"],
});
pugFiles.map((pugItem) => {
  const html = pugItem.replace(srcPath, pubPath).replace(".pug", ".html");
  // console.log("pugItem: ", pugItem);
  pugArray.push(
    new HtmlWebpackPlugin({
      inject: false,
      filename: html,
      template: pugItem,
      // data: require(srcPath + '/data/global.js')
    })
  );
});

//js-----------
// const jsObject = {};
// const jsFiles = globule.find(srcPath + "/**/*.js", {
//   ignore: [srcPath + "/*.js", srcPath + "/**/_*.js", srcPath + "/**/_*.json"],
// });
// console.log("jsFiles: ", jsFiles);
// jsFiles.map((jsItem) => {
//   const jsEntryPath = jsItem.replace(srcPath, "");
//   const jsEntryKey = jsEntryPath.split("/").slice(1, 2)[0];
//   const jsEntryValue = jsEntryPath.split("/").slice(-1)[0];
//   jsObject[jsEntryKey] = `${srcPath}/${jsEntryValue}`;
// });
// console.log("jsObject: ", jsObject);

const app = {
  mode: "development",
  entry: {
    common: srcPath + "/index.js",
    // "00": srcPath + "/00/index.js",
    // ...jsObject,
  },
  output: {
    path: pubPath,
    filename: "index.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: "pug-loader",
            options: {
              pretty: true,
              root: srcPath,
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: pubPath,
    open: true,
  },
  plugins: [...pugArray],
};

// console.log("app.entry: ", app.entry);
// console.log("app.output: ", app.output);

module.exports = app;
