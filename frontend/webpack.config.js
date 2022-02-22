const _require = (id) =>
  require(require.resolve(id, { paths: [require.main.path] }));
const Webpack = require('webpack');
const path = _require('path');
const HtmlPlugin = _require('html-webpack-plugin');
const CopyPlugin = _require('copy-webpack-plugin');
const { VueLoaderPlugin } = _require('vue-loader');
module.exports = {
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      assets: path.resolve(__dirname, 'src/assets'),
    },
  },

  entry: './src/main.js',

  output: {
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.s?css$/,
        use: ['vue-style-loader', 'style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        use: 'file-loader',
      },
    ],
  },

  plugins: [
    new HtmlPlugin({
      template: './index.html',
    }),
    new CopyPlugin({
      patterns: [{ from: 'static' }],
    }),
    new VueLoaderPlugin(),
    //Evita warning en consola
    new Webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: true,
    }),
  ],

  devServer: {
    host: 'localhost',
    port: 8080,
    hot: true,
  },
};
