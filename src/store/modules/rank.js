const state = {
  rank: {},
  weekTime: '',
  monthTime: '',
  weekRankGroup: [],
  monthRankGroup: [],
  totalRankGroup: [],
  weekRankAll: [],
  monthRankAll: [],
  totalRankAll: []
}

const mutations = {
  setRank: (state, rank) => {
    state.rank = rank
  },
  setWeekTime: (state, data) => {
    state.weekTime = { start: data.weekStart, end: data.weekEnd }
  },
  setMonthTime: (state, data) => {
    state.monthTime = { start: data.monthStart, end: data.monthEnd }
  },
  setWeekRankGroup: (state, data) => {
    state.weekRankGroup = data.userGroupWeekList
  },
  setMonthRankGroup: (state, data) => {
    state.monthRankGroup = data.userGroupMonthList
  },
  setTotalRankGroup: (state, data) => {
    state.totalRankGroup = data.userGroupList
  },
  setWeekRankAll: (state, data) => {
    state.weekRankAll = data.weekList
  },
  setMonthRankAll: (state, data) => {
    state.monthRankAll = data.monthList
  },
  setTotalRankAll: (state, data) => {
    state.totalRankAll = data.allList
  }
}

const actions = {
  getRank({ commit, state, rootState }) {
    return new Promise((resolve, reject) => {
      axios.get('/v1/rank/groupRank').then(res => {
        if (res.status === 200) {
          const rank = { week: res.data.weekList ? `${res.data.weekList ? res.data.weekList.findIndex(item => item.id === rootState.user.info.user.id) === -1 ? 0 : res.data.weekList.findIndex(item => item.id === rootState.user.info.user.id) + 1 : -1 + 1} / ${res.data.weekList ? res.data.weekList.length : 0}` : '0 / 0', month: res.data.monthList ? `${res.data.monthList ? res.data.monthList.findIndex(item => item.id === rootState.user.info.user.id) === -1 ? 0 : res.data.monthList.findIndex(item => item.id === rootState.user.info.user.id) + 1 : -1 + 1} / ${res.data.monthList ? res.data.monthList.length : 0}` : '0 / 0', total: `${res.data.allList ? res.data.allList.findIndex(item => item.id === rootState.user.info.user.id) === -1 ? 0 : res.data.allList.findIndex(item => item.id === rootState.user.info.user.id) + 1 : -1 + 1} / ${res.data.allList ? res.data.allList.length : 0}` }
          commit('setWeekTime', res.data)
          commit('setMonthTime', res.data)
          if (res.data.userGroupWeekList) {
            commit('setWeekRankGroup', res.data)
          }
          if (res.data.userGroupMonthList) {
            commit('setMonthRankGroup', res.data)
          }
          if (res.data.userGroupList) {
            commit('setTotalRankGroup', res.data)
          }
          if (res.data.weekList) {
            commit('setWeekRankAll', res.data)
          }
          if (res.data.monthList) {
            commit('setMonthRankAll', res.data)
          }
          if (res.data.allList) {
            commit('setTotalRankAll', res.data)
          }
          commit('setRank', rank)
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

