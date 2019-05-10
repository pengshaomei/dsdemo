import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import User from '@/views/user.vue'
import Rights from '@/views/rights.vue'
import Role from '@/views/role.vue'
Vue.use(Router)

export default new Router({
    routes: [{
            name: 'login',
            path: '/login',
            component: Login
        },
        {
            name: 'home',
            path: '/',
            component: Home,
            children: [{
                    name: 'user',
                    path: '/user',
                    component: User
                },
                {
                    name: 'rights',
                    path: '/rights',
                    component: Rights
                },
                {
                    name: 'role',
                    path: '/role',
                    component: Role
                }
            ]
        }
    ]

})