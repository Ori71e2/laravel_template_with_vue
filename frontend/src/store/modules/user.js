import { login, logout, getInfo, verify } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  vip: 0,
  token: getToken(),
  verified: false,
  name: '',
  introduction: '',
  dialogVisible: false,
  verify: false,
}

const mutations = {
  SET_VIP: (state, vip) => {
    state.vip = vip
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_VERIFIED: (state, verify) => {
    state.activated = verify
  },
  SET_DIALOG_VISIBLE: (state, visible) => {
    state.dialogVisible = visible
  }
}

const actions = {
  setVip({ commit }, vip) {
    commit('SET_VIP', vip)
  },
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const {code, data} = response
        commit('SET_TOKEN', data)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  verify({ commit, state }, verificationCode) {
    const username = state.username
    const code = verificationCode
    return new Promise((resolve, reject) => {
      verify({ username: username.trim(), code: code}).then(response => {
        const {code, data} = response
        commit('SET_VERIFIED', data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { name, introduction } = data
        commit('SET_NAME', name)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_INTRODUCTION', '')
        removeToken()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      resolve()
    })
  },
  setDialogVisible({ commit }, visible) {
    commit('SET_DIALOG_VISIBLE', visible)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
