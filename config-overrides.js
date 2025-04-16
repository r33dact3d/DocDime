const webpack = require('webpack');

module.exports = function override(config) {
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({}),
    })
  );
  return config;
};
