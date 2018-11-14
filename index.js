import path from 'path'

export default function (moduleOptions) {
  this.addPlugin({
    src: path.resolve(__dirname, 'src', 'plugin.js'),
    options: Object.assign({
      vuexNamespace: 'refreshAuth',
      storageKey: 'my_refresh_token_key',
      loginUrl: '/auth/login',
      refreshUrl: '/auth/refresh',
      refreshTokenKey: 'refresh_token'
    }, moduleOptions)
  })
}