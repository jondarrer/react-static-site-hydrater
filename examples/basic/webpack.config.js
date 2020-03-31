const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactStaticSiteHydrater = require('../../src');

module.exports = {
  entry: resolve(__dirname, './src/index.js'),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new ReactStaticSiteHydrater({
      routes: ['/', '/about', '/contact-us'],
    }),
  ],
};
