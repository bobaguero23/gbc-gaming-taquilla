const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
  mode: 'development',
  output: {
    publicPath: './',
  },
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
    writeToDisk: true,
  },
  target: 'electron-renderer',
  externals: {
    // global app config object
    config: JSON.stringify({
      env: 'development',
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
