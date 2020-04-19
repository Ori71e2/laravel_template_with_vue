import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    redirect: '/visitor',
  },

  {
    path: '/visitor',
    component: () => import('@/views/visitor/index'),
    meta: {
      keepAlive: true // 不需要缓存
    },
    children: [
      {
        path: 'login',
        component: () => import('@/views/visitor/login/index')
      },
      {
        path: 'register',
        component: () => import('@/views/visitor/register/index')
      },
      {
        path: 'verify',
        component: () => import('@/views/visitor/verify/index')
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
]


const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
// }

export default router
