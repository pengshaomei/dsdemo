// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/index.css'
import Httptool from '@/plugins/http.js'
import MyBread from '@/components/myBread.vue'

Vue.use(Httptool)
Vue.use(ElementUI)
    // 过滤器
Vue.filter('fmtDate', function(v) {
        return moment(v).format('YYYY-MM-DD');
    })
    // 自定义面包屑组件
Vue.component(MyBread.name, MyBread)
    // Vue.component('MyBread', MyBread)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})