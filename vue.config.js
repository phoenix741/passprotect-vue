module.exports = {
  devServer: {
    proxy: {
      '/graphql': {
        target: 'http://localhost:4000',
        ws: true,
        changeOrigin: true
      }
    }
  },

  pluginOptions: {
    i18n: {
      locale: 'fr',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    },
    cordovaPath: 'src-cordova'
  },

  chainWebpack: config => {
    config.module
      .rule('yaml')
      .test(/\.yml$/)
      .use('json-loader')
      .loader('json-loader')
      .end()
      .use('yaml-loader')
      .loader('yaml-loader')
      .end()
  },

  baseUrl: ''
}
