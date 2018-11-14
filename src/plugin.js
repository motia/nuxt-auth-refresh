const storageKey = '<%= options.storageKey %>'
const vuexNamespace = '<%= options.vuexNamespace %>'
const loginUrl = '<%= options.loginUrl %>'
const refreshTokenKey = '<%= options.refreshTokenKey %>'
const refreshUrl = '<%= options.refreshUrl %>'

const state = () => ({refreshInterval: null})

const mutations = {
  refreshInterval (state, val) {
    state.refreshInterval = val
    if (!state.refreshInterval) {
      clearInterval(state.refreshInterval)
    }
  }
}

const actions = {
  startRefreshInterval ({ dispatch, commit}, data) {
    this.$auth.$storage.setUniversal(storageKey, data[refreshTokenKey])
    this.$auth.$storage.setUniversal(storageKey + '_expiration', data[refreshTokenKey])

    const offset = 20 * 60 * 1000

    const refresher = () => {
      dispatch('attemptRefresh')
        .catch(() => {
          dispatch('stopRefreshInterval')
        })
    }
    setTimeout(
      () => commit('refreshInterval', setInterval(refresher, offset)),
      offset
    )
  },
  stopRefreshInterval ({commit}) {
    commit('refreshInterval', null)
  },
  async attemptRefresh () {
    const refreshToken = this.$auth.$storage.getUniversal(storageKey)
    if (!refreshToken) {
      return
    }
    this.$auth.login({
      url: refreshUrl,
      data: {
        [refreshTokenKey]: refreshToken
      }
    })
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
      store.dispatch(vuexNamespace+'/startRefreshInterval', response.data)
    }

    return response
  })
}
