import { login, signup } from '../../services/UserService'
import { onLogin, onLogout } from '../../plugins/vue-apollo'
import router from '../../router'

export default {
  namespaced: true,
  state: {
    authenticated: false,
    jwtToken: null,
    username: null,
    clearKey: null
  },
  mutations: {
    login (state, payload) {
      state.jwtToken = payload.jwtToken
      state.username = payload.username
      state.clearKey = payload.clearKey
      state.authenticated = true
    },
    logout (state) {
      state.authenticated = false
      state.username = null
      state.jwtToken = null
      state.clearKey = null
    }
  },
  actions: {
    async login ({ commit, getters }, { creds, $apollo }) {
      try {
        const result = await login($apollo, creds)
        commit('login', result)
        await onLogin($apollo.provider.defaultClient, getters.authenficationToken)
        router.replace('/items')
      } catch (err) {
        commit('global/addError', { field: err.fieldName, msg: err.message })
      }
    },
    async signup ({ dispatch, commit }, { creds, $apollo }) {
      // Idem login avec mutation signup + récup token
      try {
        await signup($apollo, creds)
        return await dispatch('login', { creds, $apollo })
      } catch (err) {
        commit('global/addError', { field: err.fieldName, msg: err.message })
      }
    },
    async logout ({ commit }, { $apollo }) {
      commit('logout')

      await onLogout($apollo.provider.defaultClient)

      router.push('/login')
    }
  },
  getters: {
    authenficationToken: state => state.jwtToken && state.jwtToken.split(' ')[1]
  }
}
