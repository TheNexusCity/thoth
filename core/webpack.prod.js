// eslint-disable-next-line
const Dotenv = require('dotenv-flow-webpack')
// eslint-disable-next-line
const CompressionPlugin = require('compression-webpack-plugin')
// eslint-disable-next-line
const TerserPlugin = require('terser-webpack-plugin')

const BundleAnalyzerPlugin =
  // eslint-disable-next-line
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// eslint-disable-next-line
const { merge } = require('webpack-merge')
// eslint-disable-next-line
const common = require('./webpack.common')

// eslint-disable-next-line no-undef
export default () => {
  const commonConfig = common()

  const prodConfig = {
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
  }

  // eslint-disable-next-line no-undef
  const isAnalyze = typeof process.env.BUNDLE_ANALYZE !== 'undefined'

  if (isAnalyze) {
    prodConfig.plugins.push(new BundleAnalyzerPlugin())
  }

  return merge(commonConfig, prodConfig)
}
