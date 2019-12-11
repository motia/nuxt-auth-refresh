const path = require('path')

module.exports = function (moduleOptions) {
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    ssr: false,    
    fileName: 'refresh-auth.js',
    options: Object.assign({
      vuexNamespace: 'refreshAuth',
      storageKey: 'my_refresh_token_key',
      authStrategy: 'local',
      authScheme: 'local',
      loginUrl: '/auth/login',
      logoutUrl: '/auth/logout',
      refreshUrl: '/auth/refresh',
      accessTokenKey: 'access_token',
      refreshTokenKey: 'refresh_token',
      refreshPeriod: 1800,
      refreshUsingHeader: false
    }, moduleOptions)
  })
}