import Vue from 'vue'
import Vuex from 'vuex'

import UserState from './modules/UserState'
import ItemState from './modules/ItemState'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    errors: []
  },
  getters: {
    hasError: state => !!state.errors.length
  },
  mutations: {
    addError (state, err) {
      state.errors.push(err)
    }
  },
  modules: {
    user: UserState,
    item: ItemState
  }
})
