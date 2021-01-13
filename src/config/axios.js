import axios from "axios"
import { tip } from "@/config/utils/utils"
import { baseURL } from "@/config/conf"


baseURL = ''
// 设置全局的请求次数，请求的间隙
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

export const errorResp = error => {
    if (error.response.status) {
        switch (error.response.status) {
            // 401: 未登录                
            case 401:
                break;

            // 403 token过期              
            case 403:
                break;

            // 404请求不存在
            case 404:
                tip({
                    msg: '请求不存在',
                    type: 'error'
                });
                break;
            // 其他错误，直接抛出错误提示
            default:
                tip({
                    msg: error.response.data.msg,
                    type: 'error'
                });
        }
    }
    return Promise.reject(error)
}

// 创建axios实例
var instance = axios.create({ timeout: 5000, baseURL });

instance.interceptors.request.use(config => {
    // 在此可添加token等请求拦截操作
    return config
}, error => {
    Promise.reject(error)
}
)

instance.interceptors.response.use(response => {
    if (/^[12]\d{2}$/.test(response.status)) {
        if (!response.data) {
            tip("资源请求错误")
        }
        return response.data
    } else {
        return Promise.reject(response);
    }
}, error => {
    var config = error.config;
    if (!config || !config.retry) return this.errorResp(error);

    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= config.retry) {
        // Reject with the error
        return this.errorResp(error);
    }

    // Increase the retry count
    config.__retryCount += 1;

    var backoff = new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, config.retryDelay || 1);
    });

    // Return the promise in which recalls axios to retry the request
    return backoff.then(function () {
        return axios(config);
    });

})

export default instance