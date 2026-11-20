const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const taquillaProduct = process.env.TAQUILLA_PRODUCT === 'gbc' ? 'gbc' : 'inh';

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|gif|svg|pdf|ico|eot|woff|woff2|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.TAQUILLA_PRODUCT': JSON.stringify(taquillaProduct),
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
      title: taquillaProduct === 'gbc' ? 'GBC Gaming' : 'Taquilla Física INH',
    }),
  ],
  externals: {
    // global app config object
    config: JSON.stringify({
      apiUrl: 'https://apisellertaquilla.betpredator.com/apiseller',
      apiUrlRT: 'https://apisellertaquillart.betpredator.io/apiseller',
      apiUrlRTSports: 'https://apisports-office.betpredator.com/apisports',
      apiUrlBackEnd: 'https://apisellertaquilla.betpredator.com',
      API_CASIER_RT_V2: 'wss://wshorses.betpredator.com',
      value5y6VES: 20,
      valueUnitsVES: 36,
    }),
  },

};
