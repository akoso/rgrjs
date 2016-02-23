module.exports = {
  entry: "./js/app.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { tes: /\.js$/, exclude: /node_modules/, loader: 'babel-loader',
       query: { presets: ['react', 'es2015'] } }
    ]
  }
}
