define(['axios'], function (axios) {
    //目前封装功能有：
    //     检查类型：isArr isObj isFun isEmptyObject
    //      功能函数：getUrl storage lstorage len contain toast nobodySide cover els addEv dedupe
    var tool = {

        util: {
            isEmptyObject: function (obj) {
                for (var key in obj) {
                    return false;
                }
                return true;
            }
        },

        /**
         * 生成接口Url地址
         * @param url
         * @param parameter
         * @returns {string}
         */
        cookie: function (name, value, options) {
            if (typeof value != 'undefined') { // name and value given, set cookie
                options = options || {};
                if (value === null) {
                    value = '';
                    options.expires = -1;
                }
                var expires = '';
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
                }
                // CAUTION: Needed to parenthesize options.path and options.domain
                // in the following expressions, otherwise they evaluate to undefined
                // in the packed version for some reason...
                var path = options.path ? '; path=' + (options.path) : '';
                var domain = options.domain ? '; domain=' + (options.domain) : '';
                var secure = options.secure ? '; secure' : '';
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else { // only name given, get cookie
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = cookies[i].trim();
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
        },
        getUrl: function (url, parameter) {
            if (parameter) {
                url += '?';
                for (var i = 0; i < parameter.length; i++) {
                    url += i + '=' + parameter[i] + '&';
                }

                url.substr(0, -1);
            }
            var baseURl = this.apiDomain;
            if (baseURl) {
                url = baseURl + url;
            }

            return url;

        },
        /**
         * 封装了一个sessionStorage
         */
        sstorage: function () {
            if ('sessionStorage' in window) {
                // console.log(arguments.length);
                if (arguments.length === 1) { //获取
                    var objStr = sessionStorage.getItem(arguments[0]);
                    var jsonObj = null;
                    try {
                        jsonObj = JSON.parse(objStr);
                    } catch (err) {
                        jsonObj = objStr;
                    }
                    return jsonObj;
                } else if (arguments.length === 2) { //设置
                    var objString = null
                    if (arguments[1] instanceof Object || arguments[1] instanceof Array) {
                        try {
                            objString = JSON.stringify(arguments[1]);
                            sessionStorage.setItem(arguments[0], objString);
                        } catch (err) {
                            throw new Error('储存localStorage失败！');
                        }
                    } else if (typeof arguments[1] === "string" || typeof arguments[1] === "boolean") {
                        sessionStorage.setItem(arguments[0], arguments[1]);
                    } else if (arguments[1] === null) { //删除
                        sessionStorage.removeItem(arguments[0]);
                    }
                }

            } else {
                return null;
            }
        },
        /**
         * 封装了一个localStorage
         */
        lstorage: function () {
            if ('localStorage' in window) {
                // console.log(arguments.length);
                if (arguments.length === 1) { //获取
                    var objStr = localStorage.getItem(arguments[0]);
                    var jsonObj = null;
                    try {
                        jsonObj = JSON.parse(objStr);
                    } catch (err) {
                        jsonObj = objStr;
                    }
                    return jsonObj;
                } else if (arguments.length === 2) { //设置
                    var objString = null;
                    if (arguments[1] instanceof Object || arguments[1] instanceof Array) {
                        try {
                            objString = JSON.stringify(arguments[1]);
                            localStorage.setItem(arguments[0], objString);
                        } catch (err) {
                            throw new Error('储存localStorage失败！');
                        }
                    } else if (typeof arguments[1] === "string" || typeof arguments[1] === "boolean") {
                        localStorage.setItem(arguments[0], arguments[1]);
                    } else if (arguments[1] === null) { //删除
                        localStorage.removeItem(arguments[0]);
                    }
                }

            } else {
                return null;
            }
        },
        cover: function (v) {

            if (!v) {
                var cover = document.createElement('div');
                cover.setAttribute('class', ' yl_cover');
                if (!document.querySelectorAll('.yl_cover').length) {
                    document.body.appendChild(cover);
                }
                document.querySelector('.yl_cover').style = 'display:block;';
                this.nobodySide();
            } else {
                document.querySelector('.yl_cover').style = 'display:none;';
                this.nobodySide(1);
            }

        },
        isArr: function (arr) {
            return arr instanceof Array;
        },
        isObj: function (obj) {
            return obj instanceof Object;
        },
        isFun: function (fn) {
            return fn instanceof Function;
        },
        urlPara: function (key) {
            var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
            var result = window.location.search.substr(1).match(reg);
            return result ? decodeURIComponent(result[2]) : null;
        },
        //获取对象的key的个数,
        len: function (obj) {
            if (!this.isObj(obj)) {
                throw new Error("len()方法中，所传值应该为一个对象");
            }
            var i = 0;
            for (var key in obj) {
                i++;
            }
            return i;
        },
        /**
         * 封装了一个数组中是否包含其他元素
         * @param obj  待检测元素（number,string)。
         * @returns {boolean}  false or true
         */
        contain: function (arr, obj) {
            var i = arr.length;
            if (typeof obj === "undefined") {
                throw new Error("待检测元素不能为空");
            }
            while (i--) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        },

        toast: function (text, position) {
            var timer = null;
            var position1 = position || 'middle';
            clearTimeout(timer);
            if (document.querySelector('.yl_toast')) {
                document.body.removeChild(document.querySelector('.yl_toast'));
            }
            var oDiv = document.createElement('div');
            var html = `<span style="text-align:center;font-size:.3rem;">${text}</span>`;
            oDiv.innerHTML = html;

            oDiv.innerHTML = `${text}`;
            oDiv.setAttribute("class", 'yl_toast');

            if (position1 === 'bottom') {
                oDiv.className += " " + 'yl_toast_bottom'

            } else {
                oDiv.className += " " + 'yl_toast_middle'
            }
            document.body.appendChild(oDiv);


            timer = setTimeout(function () {
                if (document.querySelector('.yl_toast')) {
                    document.body.removeChild(document.querySelector('.yl_toast'));
                }
            }, 1000);
        },

        nobodySide: function (r, els) {
            var r = r || '';
            var els = els || 'body , html';
            var nodeList = document.querySelectorAll(els);
            if (!r) {
                for (var i = 0; i < nodeList.length; i++) {
                    nodeList[i].setAttribute('class', 'NobodySide');
                }
            } else {
                for (var i = 0; i < nodeList.length; i++) {
                    nodeList[i].classList.remove('NobodySide');
                }
            }

        },
        ajax: function (url, type, dataJson, status) {
            return new Promise((resolve, reject) => {
                //创建axios实例，把基本的配置放进去
                var baseURl = this.apiDomain + '/YlShopApi/';
                if (status) {
                    baseURl = this.apiDomain;
                }

                // 是否需要拦截code==-1的状态
                let cancel, promiseArr = {}
                const CancelToken = axios.CancelToken;
                var timeout = 1000;
                const instance = axios.create({
                    //定义请求文件类型
                    timeout: timeout,
                    //定义请求根目录
                    baseURL: baseURl,
                    transformResponse: [function (data) {
                        // 对 data 进行任意转换处理
                        data = data.data;
                        return data;
                    }],
                    cancelToken: new CancelToken(function executor(c) {
                        cancel = c;
                    }),
                    cancelRequest: function () {
                        if (typeof cancel === 'function') {
                            // 取消请求
                            cancel()
                        } else {
                            console.log('cancel 不是一个方法')
                        }
                    }
                });
                instance.interceptors.request.use(config => {
                    //发起请求时，取消掉当前正在进行的相同请求
                    if (promiseArr[config.url]) {
                        promiseArr[config.url]('操作取消')
                        promiseArr[config.url] = cancel
                    } else {
                        promiseArr[config.url] = cancel
                    }
                    return config
                }, error => {
                    return Promise.reject(error)
                })

                if (type.toLowerCase() === 'post') {
                    var data = [];
                    for (var key in dataJson) {
                        data.push(key + '=' + dataJson[key]);
                    }
                    data = data.join("&");
                    return instance({
                        url: url,
                        method: type,
                        data: data,

                    }).then(res => {
                        resolve(JSON.parse(res.request.response));
                    }).catch(err => {
                        reject(JSON.parse(err.request.response.msg));
                    });
                } else {
                    return instance({
                        url: url,
                        method: type,
                        params: dataJson,

                    }).then(res => {

                        resolve(JSON.parse(res.request.response));
                    }).catch(err => {
                        reject(JSON.parse(err.request.status));
                    });
                }
            });
        },
        //数组去重
        dedupe: function (array) {
            return Array.from(new Set(array));
        },
       
    };

    return tool;
});