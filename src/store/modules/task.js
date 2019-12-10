const state = {
  shorts: [],
  longs: [],
  tasks: []
}

const mutations = {
  setShorts: (state, tasks) => {
    let shorts = []
    tasks.forEach(item => {
      if (item.taskType === 'ShortTerm') {
        shorts.push(item)
      }
    })
    shorts.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    shorts = shorts.filter(
      item => new Date(item.endDate).getTime() > new Date().getTime()
    ).concat(shorts.filter(
      item => new Date(item.endDate).getTime() < new Date().getTime()
    ))
    state.shorts = shorts
  },
  setLongs: (state, tasks) => {
    let longs = []
    tasks.forEach(item => {
      if (item.taskType !== 'ShortTerm') {
        longs.push(item)
      }
    })
    longs.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    longs = longs.filter(
      item => new Date(item.endDate).getTime() > new Date().getTime()
    ).concat(longs.filter(
      item => new Date(item.endDate).getTime() < new Date().getTime()
    ))
    state.longs = longs
  },
  setTasks: (state, tasks) => {
    state.tasks = tasks
  }
}

const actions = {
  getTask({ commit, state }, res) {
    commit('setShorts', res.data)
    commit('setLongs', res.data)
    commit('setTasks', res.data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

