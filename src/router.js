import Vue from "vue"
import VueRouter from "vue-router"


Vue.use(VueRouter)

export default new VueRouter({
    mode: "history",
    routes: [
        {
            path: '/',  // 首页
            name: "index_view",
            component: () => import("@/views/Index"),
            meta: {
                title: "首页"
            }
        },
    ]
})