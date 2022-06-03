// eslint-disable-next-line
const { merge } = require('webpack-merge')
// eslint-disable-next-line
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
