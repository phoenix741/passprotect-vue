import { fetchItems } from '../../services/ItemService'

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
      return q => {
        const searchFilter = !!q && new RegExp(q)
        return state.lines
          .filter(line => !searchFilter || searchFilter.test(line.label) || searchFilter.test(line.group))
          .sort((l1, l2) => {
            const result = l1.group && l1.group.localeCompare(l2.group)
            if (result === 0) {
              return l1.label && l1.label.localeCompare(l2.label)
            }
            return result
          })
          .reduce((acc, line) => {
            acc[line.group] = acc[line.group] || []
            acc[line.group].push(line)
            return acc
          }, {})
      }
    },
    groupCount (state, getters) {
      return q => Object.keys(getters.linesByGroup(q) || {}).length
    }
  }
}
