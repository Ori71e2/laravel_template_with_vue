import { getUrlList, getUrlTag, saveUrlList, saveUrlTag } from '@/api/url'

const state = {
  list: [],
  tag: [],
  listTrigger: 0,
  tagTrigger: 0,
  listHistory: [],
  listIndex: -1,
  tagHistory: [],
  tagIndex: -1,
  edit: false,
  drag: false,
  tagPopover: false,
  position: 0,
  scroll: false
}
// listHistory listIndex 与list一起初始化及变更， listIndex 指向当前历史
const mutations = {
  INIT_LIST: (state, list) => {
    // state.list =  JSON.parse(JSON.stringify(list))
    state.list =  list
    state.listIndex = 0
    state.listHistory = []
    state.listHistory.push(JSON.stringify(list))
  },
  SET_LIST: (state, list) => {
    // state.list =  JSON.parse(JSON.stringify(list))
    state.list =  list
    state.listIndex = state.listIndex + 1
    state.listHistory.splice(state.listIndex, state.listHistory.length-state.listIndex, JSON.stringify(list))
  },
  SET_LIST_TRIGGER: (state, val) => {
    state.listTrigger = val
    state.listIndex = state.listIndex + 1
    state.listHistory.splice(state.listIndex, state.listHistory.length-state.listIndex, JSON.stringify(state.list))
  },
  SAVE_LIST: (state) => {
    const list = JSON.parse(state.listHistory[state.listIndex])
    state.list = list
    state.listIndex = 0
    state.listHistory = []
    state.listHistory.push(JSON.stringify(list))
    // 添加网络保存功能
  },
  CANCEL_SAVE_LIST: (state) => {
    const list = JSON.parse(state.listHistory[0])
    state.list = list
    state.listIndex = 0
    state.listHistory = []
    state.listHistory.push(JSON.stringify(list))
  },
  BACKWARD_LIST_HISTORY: (state) => {
    if(state.listIndex > 0) {
      state.listIndex = state.listIndex - 1
      state.list = JSON.parse(state.listHistory[state.listIndex])
    } else {
      state.list = JSON.parse(state.listHistory[state.listIndex])
    }
  },
  FORWARD_LIST_HISTORY: (state) => {
    if(state.listIndex+1 < state.listHistory.length) {
      state.listIndex = state.listIndex + 1
      state.list = JSON.parse(state.listHistory[state.listIndex])
    } else {
      state.list = JSON.parse(state.listHistory[state.listIndex])
    }
  },
  // tag操作
  INIT_TAG: (state, tag) => {
    state.tag = tag
    state.tagIndex = 0
    state.atgHistory = []
    state.tagHistory.push(JSON.stringify(tag))
  },
  SET_TAG: (state, tag) => {
    state.tag = tag
    state.tagIndex = state.tagIndex + 1
    state.tagHistory.splice(state.tagIndex, state.tagHistory.length-state.tagIndex, JSON.stringify(tag))
  },
  SAVE_TAG: (state) => {
    const tag = JSON.parse(state.tagHistory[state.tagIndex])
    state.tag = tag
    state.tagIndex = 0
    state.tagHistory = []
    state.tagHistory.push(JSON.stringify(tag))
    // 添加网络保存功能
  },
  CANCEL_SAVE_TAG: (state) => {
    const tag = JSON.parse(state.tagHistory[0])
    state.tag = tag
    state.tagIndex = 0
    state.tagHistory = []
    state.tagHistory.push(JSON.stringify(tag))
  },
  BACKWARD_TAG_HISTORY: (state) => {
    if(state.tagIndex > 0) {
      state.tagIndex = state.tagIndex - 1
      state.tag = JSON.parse(state.tagHistory[state.tagIndex])
    } else {
      state.tag = JSON.parse(state.tagHistory[state.tagIndex])
    }
  },
  FORWARD_TAG_HISTORY: (state) => {
    if(state.tagIndex+1 < state.tagHistory.length) {
      state.tagIndex = state.tagIndex + 1
      state.tag = JSON.parse(state.tagHistory[state.tagIndex])
    } else {
      state.tag = JSON.parse(state.tagHistory[state.tagIndex])
    }
  },
  SET_TAG_POPOVER: (state, val) => {
    state.tagPopover = val
  },
  SET_TAG_TRIGGER: (state, val) => {
    state.tagTrigger = val
  },
  // 编辑操作
  SET_DRAG: (state, val) => {
    state.drag = val
  },
  SET_EDIT: (state, val) => {
    state.edit = val
  },
  SET_POSITION: (state, val) => {
    state.position = val
  },
  SET_SCROLL: (state, val) => {
    state.scroll = val
  }
 }

const actions = {
  getList({ commit }) {
    return new Promise((resolve, reject) => {
      getUrlList().then(response => {
        const list = JSON.parse(response.data)
        commit('INIT_LIST', list)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  getTag({ commit }) {
    return new Promise((resolve, reject) => {
      getUrlTag().then(response => {
        const tag = JSON.parse(response.data)
        commit('INIT_TAG', tag)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  saveList({ commit, state }) {
    commit('SAVE_LIST')
    return new Promise((resolve, reject) => {
      saveUrlList(JSON.stringify(state.list)).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  saveTag({ commit, state }) {
    commit('SAVE_TAG')
    return new Promise((resolve, reject) => {
      saveUrlTag(JSON.stringify(state.tag)).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // list 部分
  setList({ commit }, list){
    commit('SET_LIST', list)
  },
  cancelSaveList({ commit }) {
    commit('CANCEL_SAVE_LIST')
  },
  backwardListHistory({ commit }) {
    commit('BACKWARD_LIST_HISTORY')
  },
  forwardListHistory({ commit }) {
    commit('FORWARD_LIST_HISTORY')
  },
  // tag 部分
  setTag({ commit }, val) {
    commit('SET_TAG', val)
  },
  cancelSaveTag({ commit }) {
    commit('CANCEL_SAVE_TAG')
  },
  backwardTagHistory({ commit }) {
    commit('BACKWARD_TAG_HISTORY')
  },
  forwardTagHistory({ commit }) {
    commit('FORWARD_TAG_HISTORY')
  },
  setDrag({ commit }, val) {
    commit('SET_DRAG', val)
  },
  setEdit({ commit }, val) {
    commit('SET_EDIT', val)
  },
  setPosition({ commit }, val) {
    commit('SET_POSITION', val)
  },
  setScroll({ commit }, val) {
    commit('SET_SCROLL', val)
  },
  setTagPopover({ commit }, val) {
    commit('SET_TAG_POPOVER', val)
  },
  setTagTrigger({ commit }, val) {
    commit('SET_TAG_TRIGGER', val)
  },
  setListTrigger({ commit }, val) {
    commit('SET_LIST_TRIGGER', val)
  }
 }

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
