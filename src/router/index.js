import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '群管理', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: '组员管理', icon: 'group' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: '小组管理', icon: 'setting' }
      }
    ]
  },

  {
    path: '/tasks',
    component: Layout,
    meta: { title: '任务', icon: 'form' },
    children: [
      {
        path: '',
        name: 'Task',
        component: () => import('@/views/task/index'),
        meta: { title: '任务列表', icon: 'table' }
      },
      {
        path: 'create',
        name: 'Create',
        component: () => import('@/views/task/create'),
        meta: { title: '创建任务', icon: 'create' }
      },
      {
        path: ':id',
        name: 'Detail',
        component: () => import('@/views/task/detail'),
        hidden: true,
        meta: { title: '任务详情', icon: 'create' }
      },
      {
        path: 'edit/:id',
        name: 'Edit',
        component: () => import('@/views/task/edit'),
        hidden: true,
        meta: { title: '修改任务' }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    name: 'User',
    hidden: true,
    children: [
      {
        path: 'scores',
        component: () => import('@/views/user/score'), // Parent router-view
        name: 'Score',
        meta: { title: '积分明细' }
      },
      {
        path: 'messages',
        component: () => import('@/views/user/message'), // Parent router-view
        name: 'Messages',
        meta: { title: '我的消息' }
      },
      {
        path: 'personal',
        component: () => import('@/views/user/personal'), // Parent router-view
        name: 'Personal',
        meta: { title: '个人中心' }
      }
    ]
  },

  {
    path: '/rank',
    component: Layout,
    redirect: '/rank/short',
    name: 'Rank',
    meta: {
      title: '排行榜',
      icon: 'rank1'
    },
    children: [
      {
        path: 'short',
        component: () => import('@/views/rank/short'), // Parent router-view
        name: 'Short',
        meta: { title: '短期任务', icon: 'rank1' }
      },
      {
        path: 'long',
        component: () => import('@/views/rank/long'),
        meta: { title: '长期任务', icon: 'rank2' }
      },
      {
        path: 'interval',
        component: () => import('@/views/rank/interval'),
        meta: { title: '周期排行', icon: 'rank3' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router