const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactStaticSiteHydrater = require('../../').default;

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
    new HtmlWebpackPlugin(),
    new ReactStaticSiteHydrater({
      routes: ['/', '/about', '/contact-us'],
      component: App,
    }),
  ],
};
