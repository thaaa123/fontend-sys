import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
import util from '@/libs/util.js'

// 路由数据
import { frameOut, errorPage } from './routes'

import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

/**
 * @description 创建路由
 * @param {Array} routes 路由设置
 */
const createRouter = (routes = []) =>
  new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes
  })

/**
 * @description 重新设置路由
 * @param {Array} routes 额外追加的路由
 */
// eslint-disable-next-line
export function resetRouter(routes = []) {
  router.matcher = createRouter(routes).matcher
}

export const routesOutLayout = [...errorPage, ...frameOut]

// 默认的路由
export const constantRoutes = createRoutesInLayout().concat(routesOutLayout)

// 导出路由 在 main.js 里使用
const router = createRouter(constantRoutes)

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  await store.dispatch('d2admin/page/isLoaded')
  // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
  await store.dispatch('d2admin/size/isLoaded')
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some(r => r.meta.auth !== false)) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    const token = util.cookies.get('token')
    if (token && token !== 'undefined') {
      // 加载路由
      await store.dispatch('d2admin/permission/load', { to: to.fullPath })
      next()
    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
      // https://github.com/d2-projects/d2-admin/issues/138
      NProgress.done()
    }
  } else {
    // 不需要身份校验 直接通过
    next()
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('d2admin/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

/**
 * @description 创建在 layout 中显示的路由设置
 * @param {Array} routes 动态路由设置
 */
// eslint-disable-next-line
export function createRoutesInLayout(routes = []) {
  return [
    // ...frameIn,
    // ...routes
    {
      path: '/',
      redirect: { name: 'index' },
      component: layoutHeaderAside,
      children: [
        {
          path: 'index',
          name: 'index',
          meta: { title: '首页', auth: true },
          component: _import('system/index')
        },
        {
          path: 'log',
          name: 'log',
          meta: { title: '日志', auth: true },
          component: _import('system/log')
        },
        // 刷新页面 必须保留
        {
          path: 'refresh',
          name: 'refresh',
          hidden: true,
          component: _import('system/function/refresh')
        },
        // 页面重定向 必须保留
        {
          path: 'redirect/:route*',
          name: 'redirect',
          hidden: true,
          component: _import('system/function/redirect')
        },
        ...routes
      ]
    }
  ]
}

export default router
