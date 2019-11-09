import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          const routes = router.options.routes
          routes[3].hidden = false
          routes[3].children[1].hidden = false
          routes[5].children[1].hidden = false
          switch (store.getters.info.roles.length) {
            case 1 :
              routes[3].hidden = true
              routes[5].children[1].hidden = true
              if (to.path.includes('/group') || to.path.includes('/tasks/create') || to.path.includes('/tasks/edit')) {
                next('/404')
              }
              next()
              break
            case 2 :
              routes[3].children[1].hidden = true
              routes[5].children[1].hidden = true
              if (to.path.includes('/group/teams') || to.path.includes('/tasks/create') || to.path.includes('/tasks/edit')) {
                next('/404')
              }
              next()
              break
            case 3 :
              next()
              break
          }
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
