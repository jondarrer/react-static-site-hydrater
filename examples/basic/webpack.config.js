const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const babel = require('@babel/core');
const ReactStaticSiteHydrater = require('../../');

// const app = babel.transformFileSync('./src');

module.exports = {
  entry: resolve(__dirname, './src/index.js'),
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
      // component: app,
      componentPath: resolve(__dirname, 'src'),
    }),
  ],
};
