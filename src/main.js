import Vue from 'vue'
import App from './App.vue'
import jquery from 'jquery'
import router from './router'
import iview from 'iview'
import echarts from 'echarts'
import 'iview/dist/styles/iview.css'

Vue.use(iview)
Vue.config.productionTip = false

Object.defineProperty(Vue.prototype, '$jq', {value: jquery})
Object.defineProperty(Vue.prototype, '$echarts', {value: echarts})

new Vue({
    router,
    render: h => h(App),
    methods: {
        checkCode(ret) {
            if (ret.code == 1002) {
                this.$router.push('/Login');
            } else if (ret.code != 0) {
                this.$Notice.error({
                    title: ret.msg,
                    desc: ''
                });
                return false;
            }
            return true;
        }
    }
}).$mount('#app')
