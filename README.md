An ad-hoc module to periodically refresh @nuxtjs/auth for the local scheme.

## Setup

Register the module before @nuxtjs/auth and @nuxtjs/axios
```
    // nuxt.config.js
    modules: [
        ['~/modules/refresh-auth'],
        ['@nuxtjs/auth', config.auth],
        ['@nuxtjs/axios', config.axios],
    ]
```
The module will automatically start the refresh interval after logging in.

You should add a client side plugin to start the refresh interval for users authenticated from stored token.
``` 
    export default ({app, store}) {
        await (
            app.$auth.loggedIn ? app.$auth.fetchUserOnce().catch((e) => {}) : null
        )

        if(app.$auth.user) {
            store.dispatch('refreshAuth/initRefreshInterval')
        }
    }

```
The plugin will che
## Options

```
    {
      // the namespace for our vuex module
      vuexNamespace: 'refreshAuth',
      
      // a key used to store the refresh token
      storageKey: 'my_refresh_token_key',
      
      // the link for login
      loginUrl: '/auth/login',
      
      // access token key in login success response and refresh request
      refreshTokenKey: 'access_token',

      // refresh token key in login success response and refresh request
      refreshTokenKey: 'refresh_token',
    }
```
