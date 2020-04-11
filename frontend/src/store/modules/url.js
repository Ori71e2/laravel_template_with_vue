const state = {
  list: [],
  tag: [],
  listTrigger: 0,
  tagTrigger: 0,
  history: [],
  index: -1,
  edit: false,
  drag: false,
  tagPopover: false,
  position: 0,
  scroll: false
}
// history index 与list一起初始化及变更， index 指向当前历史
const mutations = {
  SET_LIST: (state, list) => {
    // state.list =  JSON.parse(JSON.stringify(list))
    state.list =  list
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
  CLEAR_HISTORY: (state) => {
    state.index = -1
    state.history = []
  },
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
  },
  SET_TAG: (state, val) => {
    // state.tag = JSON.parse(JSON.stringify(val))
    state.tag = val
  },
  SET_TAG_POPOVER: (state, val) => {
    state.tagPopover = val
  },
  SET_TAG_TRIGGER: (state, val) => {
    state.tagTrigger = val
  },
  SET_LIST_TRIGGER: (state, val) => {
    state.listTrigger = val
    state.index = state.index + 1
    state.history.splice(state.index, state.history.length-state.index, JSON.stringify(state.list))
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
  clearHistory({
    commit
  }) {
    commit('CLEAR_HISTORY')
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
  },
  setTag({
    commit
  }, val) {
    commit('SET_TAG', val)
  },
  setTagPopover({
    commit
  }, val) {
    commit('SET_TAG_POPOVER', val)
  },
  setTagTrigger({
    commit
  }, val) {
    commit('SET_TAG_TRIGGER', val)
  },
  setListTrigger({
    commit
  }, val) {
    commit('SET_LIST_TRIGGER', val)
  }
 }

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
