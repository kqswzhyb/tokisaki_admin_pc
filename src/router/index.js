// import Vue from 'vue'
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
    component: () => import('@/views/account/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/account/register'),
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
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  },

  {
    path: '/group',
    component: Layout,
    redirect: '/group/members',
    name: 'Group',
    meta: { title: '群管理', icon: 'example', role: 2 },
    children: [
      {
        path: 'members',
        name: 'Members',
        component: () => import('@/views/group/member'),
        meta: { title: '组员管理', icon: 'group', role: 2 }
      },
      {
        path: 'teams',
        name: 'Teams',
        component: () => import('@/views/group/team'),
        meta: { title: '小组管理', icon: 'setting', role: 3 }
      }
    ]
  },

  {
    path: '/reward',
    component: Layout,
    meta: { title: '积分奖励', icon: 'example' },
    hidden: true,
    children: [
      {
        path: '',
        name: 'Reward',
        component: () => import('@/views/reward'),
        meta: { title: '积分奖励一览', icon: 'group' }
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
        path: 'record/:id',
        name: 'Commit',
        hidden: true,
        component: () => import('@/views/task/record'),
        meta: { title: '提交总览', icon: 'table', role: 3 }
      },
      {
        path: 'create',
        name: 'Create',
        component: () => import('@/views/task/create'),
        meta: { title: '创建任务', icon: 'create', role: 3 }
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
        meta: { title: '修改任务', role: 3 }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    name: 'User',
    redirect: '/user/personal',
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
      },
      {
        path: 'record/:id',
        component: () => import('@/views/user/record'), // Parent router-view
        name: 'Record',
        meta: { title: '提交记录' }
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
        name: 'Long',
        component: () => import('@/views/rank/long'),
        meta: { title: '长期任务', icon: 'rank2' }
      },
      {
        path: 'interval',
        name: 'Interval',
        component: () => import('@/views/rank/interval'),
        meta: { title: '周期排行', icon: 'rank3' }
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect')
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = (routes) => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes
})

const router = createRouter(constantRoutes)

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter(routes) {
  const newRouter = createRouter(routes)
  router.matcher = newRouter.matcher // reset router
}

export default router
