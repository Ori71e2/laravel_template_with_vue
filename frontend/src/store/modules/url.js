const state = {
  list: [],
  history: [],
  index: -1,
  edit: false,
  drag: {
    page: false,
    group: false,
    box: false
  },
  position: 0,
  scroll: false
}
// history index 与list一起初始化及变更， index 指向当前历史
const mutations = {
  SET_LIST: (state, list) => {
    state.list =  JSON.parse(JSON.stringify(list))
    state.index = state.index + 1
    state.history.splice(state.index, state.history.length-state.index, JSON.stringify(list))
  },
  BACKWARD_HISTORY: (state) => {
    if(state.index > 0) {
      state.index = state.index - 1
      state.list = JSON.parse(state.history[state.index])
    } else {
      state.list = JSON.parse(state.history[state.index])
    }
  },
  FORWARD_HISTORY: (state) => {
    if(state.index+1 < state.history.length) {
      state.index = state.index + 1
      state.list = JSON.parse(state.history[state.index])
    } else {
      state.list = JSON.parse(state.history[state.index])
    }
  },
  SET_DRAG: (state, val) => {
    state.drag = JSON.parse(JSON.stringify(val))
  },
  SET_EDIT: (state, val) => {
    state.exit = val
  },
  SET_POSITION: (state, val) => {
    state.position = val
  },
  SET_SCROLL: (state, val) => {
    state.scroll = val
  }
 }

const actions = {
  setList({
    commit
  }, list){
    commit('SET_LIST', list)
  },
  backwardHistory({
    commit
  }) {
    commit('BACKWARD_HISTORY')
  },
  forwardHistory({
    commit
  }) {
    commit('FORWARD_HISTORY')
  },
  setDrag({
    commit
  }, val) {
    commit('SET_DRAG', val)
  },
  setEdit({
    commit
  }, val) {
    commit('SET_EDIT', val)
  },
  setPosition({
    commit
  }, val) {
    commit('SET_POSITION', val)
  },
  setScroll({
    commit
  }, val) {
    commit('SET_SCROLL', val)
  }
 }

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
