import axios from "axios"

// 环境的切换
if (process.env.NODE_ENV === "development") {
    axios.defaults.baseURL = "http://localhost:9001/api";
} else if (process.env.NODE_ENV === "production") {
    axios.defaults.baseURL = "http://localhost:9001/api";
}

// 创建axios实例
var instance = axios.create({ timeout: 1000 * 12 });

instance.interceptors.request.use(config => {
    return config
    }, error => {
        Promise.reject(error)
    }
)

instance.interceptors.response.use(response => {
    return response
    // return response.data
}, error => {
    return Promise.reject(error)
}
)

export default instance