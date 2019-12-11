An ad-hoc module to periodically refresh @nuxtjs/auth for the local scheme.
[![Build Status](https://travis-ci.com/haosx86/nuxt-auth-refresh.svg?branch=master)](https://travis-ci.com/haosx86/nuxt-auth-refresh)

## Setup
- Install the npm package
```bash
npm install nuxt-auth-refresh
# or 
yarn add nuxt-auth-refresh
```
- Register the module before @nuxtjs/auth and @nuxtjs/axios
```js
// nuxt.config.js
modules: [
    ['nuxt-auth-refresh', config.refreshAuth],
    ['@nuxtjs/auth', config.auth],
    ['@nuxtjs/axios', config.axios],
]
```
The module will automatically start the refresh interval after logging in.

- Add a client side plugin to start the refresh interval for users authenticated from stored token.
```js
// ~/plugins/refresh-auth-token.js
export default ({app, store}) => {
    await (
        app.$auth.loggedIn ? app.$auth.fetchUserOnce().catch((e) => {}) : null
    )

    if(app.$auth.user) {
        app.$authRefresh.initRefreshInterval()
    }
}

// nuxt.config.js
plugins: [
    ...
    '~/plugins/refresh-auth-token'
]
```

- You can attach an error handler for the refresh attempts
```js
app.$authRefresh.onRefreshError((e) => {
    // handle the token refresh here
})
```

## Options

```js
{
  // the namespace for our vuex module
  vuexNamespace: 'refreshAuth',

  // a key used to store the refresh token
  storageKey: 'my_refresh_token_key',

  // the link for login
  loginUrl: '/auth/login',

  // access token key in login success response and refresh request
  accessTokenKey: 'access_token',

  // refresh token key in login success response and refresh request
  refreshTokenKey: 'refresh_token',
}
```
