import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const noTokenRouteList = ['/visitor/login', '/visitor/register', '/visitor/verify']
const hasTokenRouteList = ['/visitor/verify']
router.beforeEach(async(to, from, next) => {
  console.log('to path: ' + to.path)
  NProgress.start()
  const token = store.getters.token
  const verify = store.state.user.verify
  const vip = store.state.user.vip
  const listVip = store.state.url.listVip
  if (token) {
    // 已登录且路由去向为login、register
    if (noTokenRouteList.indexOf(to.path) !== -1) {
      next({ path: '/' })
      NProgress.done()
    // 已登录未验证账户且路由去向为verify
    } else if (!verify && hasTokenRouteList.indexOf(to.path) !== -1){
      store.dispatch('user/setDialogVisible', true)
      next({ path: '/' })
      NProgress.done()
    } else {
      if (!listVip) {
        const flag1 = await store.dispatch('url/getList')
        const flag2 = await store.dispatch('url/getTag')
        if(flag1 && flag2) {
          store.dispatch('url/setListVip', true)
        }
        console.log('VIP')
      }
      next()
      NProgress.done()
    }
  } else {
    // 未登录且路由去向为login、register
    if (noTokenRouteList.indexOf(to.path) !== -1) {
      store.dispatch('user/setDialogVisible', true)
      next()
      NProgress.done()
    } else {
      store.dispatch('url/getList')
      store.dispatch('url/getTag')
      next()
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
