import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Transaction from '../views/Transaction'
import User from '../views/User'
import Log from '../views/Log'
import HelpDesk from '../views/HelpDesk'
import Players from '../views/Players'
import Financial from '../views/Financial'

import { apiSessionVerify } from '../service'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/financial',
    name: 'Financial',
    component: Financial,
  },
  {
    path: '/transaction',
    name: 'Transaction',
    component: Transaction,
  },
  {
    path: '/user',
    name: 'User',
    component: User,
  },
  {
    path: '/players',
    name: 'Players',
    component: Players,
  },
  {
    path: '/log',
    name: 'Log',
    component: Log,
  },
  {
    path: '/helpdesk',
    name: 'HelpDesk',
    component: HelpDesk,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});


router.beforeResolve((to, from, next) => {
    apiSessionVerify()
      .then(() => {
        next()
      }).catch(() => {
        if (to.name !== "Login") {
          next({ name: 'Login' })
        } else {
          next()
        }
      })
  })

export default router
