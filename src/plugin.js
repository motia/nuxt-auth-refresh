const STORAGE_KEY = '<%= options.storageKey %>'
const VUEX_NAMESPACE = '<%= options.vuexNamespace %>'
const LOGIN_URL = '<%= options.loginUrl %>'
const LOGOUT_URL = '<%= options.logoutUrl %>'
const ACCESS_TOKEN_KEY = '<%= options.accessTokenKey %>'
const REFRESH_TOKEN_KEY = '<%= options.refreshTokenKey %>'
const REFRESH_URL = '<%= options.refreshUrl %>'
const REFRESH_USING_HEADER = '<%= options.refreshUsingHeader %>'
const REFRESH_PERIOD = '<%= options.refreshPeriod %>' * 1000
const AUTH_STRATEGY = '<%= options.authStrategy %>'
const AUTH_SCHEME = '<%= options.authScheme %>'

const _attemptRefresh = AUTH_SCHEME === 'local' ? 
  async ($auth, $axios, refreshToken) => {
    const responseData = await $auth.request(
      {
        url: REFRESH_URL,
        method: 'post',
        data: {
          [REFRESH_TOKEN_KEY]: refreshToken
        }
      }
    )
    $auth.setToken(AUTH_STRATEGY, responseData[ACCESS_TOKEN_KEY])
    $axios.setHeader(
      'Authorization',
      'Bearer ' + responseData[ACCESS_TOKEN_KEY]
    )
    return responseData
  } : ($auth, _, refreshToken) => {
    return $auth.loginWith(AUTH_STRATEGY, {
      data: {
        refresh_token: refreshToken
      }
    })
  }

const state = () => ({refreshInterval: null})

const mutations = {
  refreshInterval (state, val) {
    if (state.refreshInterval) {
      clearInterval(state.refreshInterval)
    }
    state.refreshInterval = val
  },
  refreshToken (state, refreshToken) {
    this.$auth.$storage.setUniversal(STORAGE_KEY, refreshToken)
  }
}

const actions = {
  initRefreshInterval({ dispatch }) {
    dispatch(
      'resetRefreshInterval', 
      this.$auth.$storage.getUniversal(STORAGE_KEY)   
    )
  },
  resetRefreshInterval ({ dispatch, commit }, refreshToken) {
    dispatch('stopRefreshInterval')
    commit('refreshToken', refreshToken)
 
    const refresher = () => {
      dispatch('attemptRefresh')
    }

    setTimeout(
      () => commit('refreshInterval', setInterval(refresher, REFRESH_PERIOD)),
      REFRESH_PERIOD / 2
    )
  },
  stopRefreshInterval ({commit}) {
    commit('refreshInterval', null)
  },
  async attemptRefresh ({dispatch, commit}) {
    const refreshToken = this.$auth.$storage.getUniversal(STORAGE_KEY)
    if (!refreshToken && !REFRESH_USING_HEADER) {
      throw new Error('Refresh token is required')
    }

    try {      
      const responseData = await _attemptRefresh(this.$auth, this.$axios, refreshToken)
      commit(
        'refreshToken',
        responseData[REFRESH_TOKEN_KEY] || null
      )
    } catch (e) {
      dispatch('stopRefreshInterval')
      throw e
    }
  }
}

const storeModule = {
  state, actions, mutations, namespaced: true
}

export default ({$axios, store}) => {
  store.registerModule(VUEX_NAMESPACE, storeModule, {
    preserveState: Boolean(store.state[VUEX_NAMESPACE])
  })

  
  $axios.interceptors.response.use(function (response) {
    if (response.config.url.indexOf(LOGIN_URL) !== -1) {
      store.dispatch(
        VUEX_NAMESPACE + '/resetRefreshInterval', 
        response.data[REFRESH_TOKEN_KEY] || null
      )
    }

    return response
  })

  $axios.interceptors.response.use(function (response) {
    if (response.config.url.indexOf(LOGOUT_URL) !== -1) {
      store.dispatch(VUEX_NAMESPACE + '/stopRefreshInterval')
    }

    return response
  })
}
