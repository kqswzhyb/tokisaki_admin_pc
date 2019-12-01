import { getToken, removeToken } from '@/utils/auth'
import router, { resetRouter, constantRoutes } from '@/router'
import axios from 'axios'

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
      axios({
        method: 'GET',
        url: 'http://localhost:8090/api/me',
        headers: { Authorization: `Bearer ${getToken()}` }
      }).then(res => {
        if (res.status === 200) {
          commit('SET_INFO', Object.assign({}, res.data, { totalScore: Number(res.data.user.totalScore) }))
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

