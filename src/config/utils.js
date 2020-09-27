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
 * throttle 节流函数
 */
export const throttle = (func, wait) => {
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