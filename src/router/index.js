import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Users from '@/views/users.vue'
import Rights from '@/views/rights.vue'
import Role from '@/views/role.vue'
import Cateparams from '@/views/cateparams'
import Goodscate from '@/views/goodscate'
import Goodslist from '@/views/goodslist'
import GoodsAdd from '@/views/goodsadd'


Vue.use(Router)
const router = new Router({
  routes: [{
    name: 'home',
    path: '/',
    component: Home,
    children: [
      {name:'users',path: '/users', component: Users},
      {name:'rights',path: '/rights', component: Rights},
      {name:'roles',path: '/roles', component: Role},
      {name:'cateparams',path: '/params', component: Cateparams},
      {name:'goodscate',path: '/categories', component: Goodscate},
      {name:'goodslist',path: '/goods', component: Goodslist},{
        name:'goodsadd',path:'/goods/add',component:GoodsAdd
      }]
  }, {
    name: 'login',
    path: '/login',
    component: Login
  }]
})

/* 导航守卫
在导航生效前 会先来到下面这个方法
*/
router.beforeEach((to, from, next) => {
  // ...
  // console.log(to,from);
  // 如果要去的是登录组件
  if (to.path==='/login') {
    next()
  } else {
    // / -> home
    const token = sessionStorage.getItem('token')
    if (!token) {
      // 如果要去的不是登录组件并且没有token,就跳转到登录组件
      router.push('/login')
      return
    }
    // 如果要去的不是登录组件并且有token
    next()
  }
    // if (!token) {
    //   this.$message.warning('请先登录')
    //   this.$router.push('/login')
    // }
  // next()

})
export default router


