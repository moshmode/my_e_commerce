import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from "./router";
import './assets/global.css'
import axios from "axios";

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(ElementUI)

axios.interceptors.request.use(config => {
    config.headers.token = window.sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios


new Vue({
    render: h => h(App),
    router
}).$mount('#app')
