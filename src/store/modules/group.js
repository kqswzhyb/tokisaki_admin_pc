const state = {
  groups: []
}

const mutations = {
  setGroups: (state, groups) => {
    state.groups = groups
  }
}

const actions = {
  getGroups({ commit, state, rootState }) {
    return new Promise((resolve, reject) => {
      axios.get('/v1/usergroup/listall').then(res => {
        if (res.status === 200) {
          commit('setGroups', res.data)
        }
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

