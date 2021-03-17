const { resolve } = require('path');

const pkg = require('./package.json');

module.exports = {
  entry: resolve(__dirname, './src/index.js'),
  devtool: 'source-map',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: pkg.name,
    libraryTarget: 'umd',
    publicPath: '/dist/',
    globalObject: 'this',
    umdNamedDefine: true,
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
  resolve: {
    fallback: {
      net: false,
      tls: false,
      dns: false,
    },
    alias: {
      react: resolve(__dirname, './node_modules/react'),
      'react-dom': resolve(__dirname, './node_modules/react-dom'),
      'react-router-dom': resolve(__dirname, './node_modules/react-router-dom'),
      'react-helmet-async': resolve(
        __dirname,
        './node_modules/react-helmet-async'
      ),
      '@apollo/client': resolve(__dirname, './node_modules/@apollo/client'),
    },
  },
  externals: {
    // Don't bundle react or react-dom
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React',
    },
    'react-dom/server': {
      commonjs: 'react-dom/server',
      commonjs2: 'react-dom/server',
      amd: 'ReactDOMServer',
      root: 'ReactDOMServer',
    },
    'react-router-dom': {
      commonjs: 'react-router-dom',
      commonjs2: 'react-router-dom',
      amd: 'ReactRouterDOM',
      root: 'ReactRouterDOM',
    },
    'react-helmet-async': {
      commonjs: 'react-helmet-async',
      commonjs2: 'react-helmet-async',
      amd: 'ReactHelmetAsync',
      root: 'ReactHelmetAsync',
    },
    '@apollo/client': {
      commonjs: '@apollo/client',
      commonjs2: '@apollo/client',
      amd: 'ApolloClient',
      root: 'ApolloClient',
    },
  },
};
