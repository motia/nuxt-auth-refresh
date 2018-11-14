
An ad hoc module to add authentication refresh to @nuxtjs/auth

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


## Options

```
    {
      // the namespace for our vuex module
      vuexNamespace: 'refreshAuth',
      
      // a key used to store the refresh token
      storageKey: 'my_refresh_token_key',
      
      // the link for login
      loginUrl: '/auth/login',
      
      // token key in login success response and refresh request
      refreshTokenKey: 'refresh_token'
    }
```
