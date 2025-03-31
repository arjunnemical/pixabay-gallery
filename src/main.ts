import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/global.scss'
import './styles/tailwind.scss'
import PhotoSwipe from 'vue-pswipe';


Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

Vue.use(PhotoSwipe)
