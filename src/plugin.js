const storageKey = '<%= options.storageKey %>'
const vuexNamespace = '<%= options.vuexNamespace %>'
const loginUrl = '<%= options.loginUrl %>'
const logoutUrl = '<%= options.logoutUrl %>'
const accessTokenKey = '<%= options.accessTokenKey %>'
const refreshTokenKey = '<%= options.refreshTokenKey %>'
const refreshUrl = '<%= options.refreshUrl %>'
const refreshUsingHeader = '<%= options.refreshUsingHeader %>'
const state = () => ({refreshInterval: null})

const mutations = {
  refreshInterval (state, val) {
    if (!val) {
      clearInterval(state.refreshInterval)
    }
    state.refreshInterval = val
  },
  refreshToken (state, refreshToken) {
    this.$auth.$storage.setUniversal(storageKey, refreshToken)
  }
}

const actions = {
  initRefreshInterval({ dispatch }) {
    dispatch(
      'resetRefreshInterval', 
      this.$auth.$storage.getUniversal(storageKey)   
    )
  },
  resetRefreshInterval ({ dispatch, commit }, refreshToken) {
    dispatch('stopRefreshInterval')
    commit('refreshToken', refreshToken)

    const offset = 20 * 60 * 1000
 
    const refresher = () => {
      dispatch('attemptRefresh')
    }

    setTimeout(
      () => commit('refreshInterval', setInterval(refresher, offset)),
      10 * 60 * 1000
    )
  },
  stopRefreshInterval ({commit}) {
    commit('refreshInterval', null)
  },
  async attemptRefresh ({commit, dispatch}) {
    const refreshToken = this.$auth.$storage.getUniversal(storageKey)
    if (!refreshToken && !refreshUsingHeader) {
      throw new Error('Refresh token is required')
    }

    try {
      const responseData = await this.$auth.request(
        {
          url: refreshUrl,
          method: 'post',
          data: {
            [refreshTokenKey]: refreshToken
          }
        }
      )
      
      this.$auth.setToken('local', responseData[accessTokenKey])
      this.$axios.setHeader(
        'Authorization',
        'Bearer ' + responseData[accessTokenKey]
      )

      commit(
        'refreshToken',
        responseData[refreshTokenKey] || null
      )
      
    } catch (e) {
      dispatch('stopRefreshInterval')
      if(e.response && e.response.status === 401) {
        throw new 'Refresh unauthenticated'
      } 
    }
  }
}

const storeModule = {
  state, actions, mutations, namespaced: true
}

export default ({$axios, store}) => {
  store.registerModule(vuexNamespace, storeModule, {
    preserveState: Boolean(store.state[vuexNamespace])
  })

  
  $axios.interceptors.response.use(function (response) {
    if (response.config.url.indexOf(loginUrl) !== -1) {
      store.dispatch(
        vuexNamespace + '/resetRefreshInterval', 
        response.data[refreshTokenKey] || null
      )
    }

    return response
  })

  $axios.interceptors.response.use(function (response) {
    if (response.config.url.indexOf(logoutUrl) !== -1) {
      store.dispatch(vuexNamespace + '/stopRefreshInterval')
    }

    return response
  })
}
