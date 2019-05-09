import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import User from '@/views/user.vue'
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
                path: '/user',
                component: User
            }]
        }
    ]

})