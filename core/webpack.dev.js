const { merge } = require('webpack-merge')
const common = require('./webpack.common')

// eslint-disable-next-line no-undef
module.exports = () => {
  const commonConfig = common()

  const devConfig = {
    mode: 'development',
    devtool: 'source-map',
  }

  return merge(commonConfig, devConfig)
}
