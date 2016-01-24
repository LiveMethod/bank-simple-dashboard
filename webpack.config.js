module.exports = {
  // where webpack should look (./views/)
  context: __dirname + '/views',
  entry: {
    javascript: './reactapp.js',
  },
  output: {
    filename: 'reactapp.js',
    path: __dirname + '/public/js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel?presets[]=react&presets[]=es2015',
      },
    ],
  },
}