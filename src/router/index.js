import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-admin-template-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin', 'admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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
    path: '/',
    component: Layout,
    redirect: '/pc/home',
    children: [{
      path: 'pc/home',
      name: 'Dashboard',
      component: () => import('@/views/pc/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-data-line' }
    },
    { path: '/pc/data/wholesale', component: () => import(/* webpackChunkName: 'pc-data-wholesale' */ '@/views/pc/data/Wholesale.vue') },
    { path: '/pc/data/retail', component: () => import(/* webpackChunkName: 'pc-data-retail' */ '@/views/pc/data/Retail.vue') },
    { path: '/pc/data/price', component: () => import(/* webpackChunkName: 'pc-data-price' */ '@/views/pc/data/Price.vue') },
    { path: '/pc/customer/lng', component: () => import(/* webpackChunkName: 'pc-customer-lng' */ '@/views/pc/customer/Lng.vue') },
    { path: '/pc/customer/pipeline', component: () => import(/* webpackChunkName: 'pc-customer-pipeline' */ '@/views/pc/customer/Pipeline.vue') },
    { path: '/pc/customer/retail', component: () => import(/* webpackChunkName: 'pc-customer-retail' */ '@/views/pc/customer/Retail.vue') },
    { path: '/pc/report/import', component: () => import(/* webpackChunkName: 'pc-report-import' */ '@/views/pc/report/Import.vue') },
    { path: '/pc/report/export', component: () => import(/* webpackChunkName: 'pc-report-export' */ '@/views/pc/report/Export.vue') },
    { path: '/pc/setting/user', component: () => import(/* webpackChunkName: 'pc-setting-user' */ '@/views/pc/setting/User.vue') }
    ]
  },
  {
    path: '/screen',
    component: () => import('@/views/screen/layout/index'),
    redirect: '/screen/home',
    hidden: true,
    children: [
      { path: '/screen/home', component: () => import('@/views/screen/dashboard/index') },
      // { path: '/screen/guanxian', component: () => import('@/views/screen/guanxian/index') },
      { path: '/screen/wholesale', component: () => import('@/views/screen/wholesale/index') },
      { path: '/screen/wholesale/detail', component: () => import('@/views/screen/wholesale/detail') },
      { path: '/screen/retail', component: () => import('@/views/screen/retail/index') },
      { path: '/screen/retail/detail', component: () => import('@/views/screen/retail/detail') },
      { path: '/screen/customer', component: () => import('@/views/screen/customer/index') },
      { path: '/screen/price', component: () => import('@/views/screen/price/index') }

    ]

  },
  {
    path: '/guanxian',
    component: () => import('@/views/guanxian/index'),
    hidden: true
  }

]

export const asyncRoutes = [
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: '首页', icon: 'el-icon-data-line' }
  //   }]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }

]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
