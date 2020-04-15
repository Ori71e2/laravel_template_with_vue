import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/visitor/login', '/visitor/register'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  console.log(to.path)
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    console.log(hasToken)
    try {
      // get user info
      // const UserInfo = await store.dispatch('user/getInfo')
      if (whiteList.indexOf(to.path) !== -1) {
        next({ path: '/' })
        NProgress.done()
      } else {
        next()
        NProgress.done()
      }
    } catch (error) {
      // remove token and go to login page to re-login
      // await store.dispatch('user/resetToken')
      // Message.error(error || 'Has Error')
      next()
      NProgress.done()
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      console.log(store)
      store.dispatch('user/setDialogVisible', true)
      next()
      NProgress.done()
    } else {
      next()
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
