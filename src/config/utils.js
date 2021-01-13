import { Message, MessageBox } from "element-ui";

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== "string") {
        content = JSON.stringify(content);
    }

    sessionStorage.setItem(name, content);
}

/**
 * 获取localStorage 
 */
export const getStore = name => {
    if (!name) return;
    return sessionStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return;
    sessionStorage.removeItem(name);
}

/** 
 * 提示函数
 * @param {String} msg 显示的信息
 * @param {String} type 弹窗的类型
 */
export const tip = (msg, type = "warning", duration = 2000) => {
    Message({
        message: msg,
        type: type,
        duration: duration,
        showClose: true
    });
}

/**
 * 弹出框
 * @param {String} msg 显示的信息
 * @param {String} title 标题
 * @param {Object} obj 包含{type 类型, confirmButtonText 确认按钮文字, cancelButtonText 取消按钮文字}
 */
export const alertConfirm = (msg, type = "warning", title = "提示", obj = {}) => {
    let def = { confirmButtonText: "确定", cancelButtonText: "取消", ...obj }
    return MessageBox.confirm(msg, title, { ...def, type })
}

/**
 * debounce 防抖函数
 * @param {Function} func 需要防抖的函数
 * @param {Number} delay 等待时长
 */
export const debounce = (func, delay = 500) => {
    let timeout;
    return function () {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), delay);
    }
}

/**
 * throttle 节流函数
 * @param {Function} func 需要节流的函数
 * @param {Number} wait 等待时长
 */
export const throttle = (func, wait = 500) => {
    let timeout, context, args;
    let old = 0;
    let later = function () {
        old = Date.now()
        timeout = null;
        func.apply(context, args)
    }

    return function () {
        args = arguments, context = this;
        let now = Date.now();
        if (now - old > wait) {
            if (timeout) {
                clearTimeout(timeout)
                timeout = null
            }

            func.apply(context, args)
            old = now
        } else if (!timeout) {
            timeout = setTimeout(later, wait)
        }
    }
}

/**
 * 深拷贝
 */
export const deepCopy = (obj, cache = new WeakMap()) => {
    if (!obj instanceof Object) return obj
    // 防止循环引用
    if (cache.get(obj)) return cache.get(obj)
    // 支持函数
    if (obj instanceof Function) {
        return function () {
            return obj.apply(this, arguments)
        }
    }
    let res = Array.isArray(obj) ? [] : {}
    cache.set(obj, res)

    Object.keys(obj).forEach(key => {
        if (obj[key] instanceof Object) {
            res[key] = deepCopy(obj[key], cache)
        } else {
            res[key] = obj[key]
        }
    });
    return res
}
