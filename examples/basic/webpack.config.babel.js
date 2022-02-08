const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactStaticSiteHydrater = require('../../');

module.exports = {
  entry: resolve(__dirname, './src'),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        include: resolve(__dirname, 'src'),
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ filename: 'default.html' }),
    new ReactStaticSiteHydrater({
      routes: ['/', '/about', '/404-not-found'],
      componentPath: resolve(__dirname, './src/app.js'),
      plugins: ['react-router'],
    }),
  ],
};
