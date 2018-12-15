import { fetchItems, filterLines, groupLineByGroup } from '../../services/ItemService'

export default {
  namespaced: true,
  state: {
    loading: false,
    lines: []
  },
  mutations: {
    setLines (state, lines) {
      state.loading = false
      state.lines = lines
    },
    startLoading (state) {
      state.loading = true
    }
  },
  actions: {
    async fetchItems ({ commit }, { $apollo }) {
      try {
        commit('startLoading')
        const result = await fetchItems($apollo)
        commit('setLines', result)
      } catch (err) {
        commit('global/addError', { field: err.fieldName, msg: err.message })
      }
    }
  },
  getters: {
    linesByGroup (state) {
      return q => groupLineByGroup(filterLines(state.lines, q))
    },
    groupCount (state, getters) {
      return q => Object.keys(getters.linesByGroup(q) || {}).length
    }
  }
}
