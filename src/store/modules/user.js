import { getToken, removeToken } from '@/utils/auth'
import router, { resetRouter, constantRoutes } from '@/router'
// import axios from 'axios'

const state = {
  token: getToken(),
  info: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INFO: (state, info) => {
    state.info = info
  },
  ADD_SCORE: (state, score) => {
    state.info.user.totalScore += score
  }
}

const actions = {

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios.get('/me').then(res => {
        if (res.status === 200) {
          const info = Object.assign({}, res.data)
          res.data.user.totalScore = res.data.user.totalScore ? Number(res.data.user.totalScore) : 0
          commit('SET_INFO', info)
        }
        resolve(res.data)
      }).catch(error => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter(constantRoutes)
        router.push(`/login?redirect=dashboard`)
        reject(error)
      })
    })
  },
  getCommon({ commit, dispatch, state, rootState }) {
    return new Promise((resolve, reject) => {
      axios.all([axios.get('/v1/usergroup/listall'), axios.get('/v1/rank/groupRank'), axios.get('/v1/task')])
        .then(axios.spread((res, res2, res3) => {
          dispatch('rank/getRank', res2, { root: true })
          dispatch('task/getTask', res3, { root: true })
          dispatch('group/getGroups', res, { root: true })
          resolve(true)
        })).catch(() => {
          reject(new Error('请求错误'))
        })
    })
  },

  // user logout
  logout({ commit }) {
    commit('SET_TOKEN', '')
    removeToken()
    resetRouter(constantRoutes)
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

