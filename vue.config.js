module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
  },
  pluginOptions: {
    apollo: {
      lintGQL: false
    }
  },
  publicPath: "./"
}
