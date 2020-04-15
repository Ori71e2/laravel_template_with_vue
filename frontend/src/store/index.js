import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import url from './modules/url'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    url
  },
  getters
})

export default store
