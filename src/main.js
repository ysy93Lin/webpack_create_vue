import Vue from "vue"
import App from "./App"
import VueRouter from "vue-router"
import router from "./router"


new Vue({
    render: h => h(App),
}).$mount(document.getElementById("app"))