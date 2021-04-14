import Vue from 'vue'
import Router from 'vue-router'
import myHeader from '../components/myHeader'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: myHeader
    },
    {
      path: '/editor',
      name: 'myEditor',
      component: () => import('../pages/myEditor')
    },
    {
      path: '/assign',
      name: 'assignTask',
      component: () => import('../pages/assignTask')
    },
    {
      path: '/edit',
      name: 'edit',
      component: () => import('../pages/edit')
    },
    {
      path: '/check',
      name: 'check',
      component: () => import('../pages/check')
    },

  ]
})