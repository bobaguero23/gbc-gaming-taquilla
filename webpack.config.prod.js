const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
  mode: 'production',
  target: 'electron-renderer',
  output: {
    path: __dirname + '/dist',
    publicPath: './',
    filename: '[name].[contenthash:8].js'
  },
  optimization: {
    minimize: false,
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  externals: {
    // global app config object
    config: JSON.stringify({
      apiUrl: '',
      apiUrlRT: '',
      apiUrlRTSports: '',
      apiUrlBackEnd: '',
      API_CASIER_RT_V2: '',
      value5y6VES: 20,
      valueUnitsVES: 36,
    }),
  },
});