module.exports = {
  publicPath: process.env.NODE_ENV === 'github' ? '/influxdb-exporter/' : '/',
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/i,
          use: 'raw-loader'
        }
      ]
    }
  }
};
