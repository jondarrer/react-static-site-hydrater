const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactStaticSiteHydrater = require('../../');

const App = require('./src/app');

module.exports = {
  entry: resolve(__dirname, './src'),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js',
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
      component: App,
      plugins: ['react-router', 'helmet'],
    }),
  ],
};
