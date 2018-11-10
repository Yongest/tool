/** * * Created by Andy on 2018/7/20,email:1046788379@qq.com。*/
'use strict';
//created by zy on 2018-1-31  ,email:1046788379@qq.com
(function (window) {
    //创建一个构造函数
    function Yl() {
    }

    //给这个构造函数的原型添加属性方法
    var userAgent = window.navigator.userAgent;
    Yl.prototype = {
        version: "1.0.0",
        isAndoid: userAgent.indexOf("Android") > -1,
        isiOS: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        isWeiXin: userAgent.indexOf('MicroMessenger') > -1,
        isPc:function () {
            var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod"];
            var isPc = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgent.indexOf(Agents[v]) > 0) {
                    isPc = false;
                    break;
                }
            }
            if (window.screen.width >= 768) {
                isPc = true;
            }
            return isPc;
        },

        getMobileInfo:function() {
            var info = {
                userAgent: userAgent,    //浏览器信息，手机型号，系统
                date: new Date().toLocaleString(),    //收集时间
                ratio: window.devicePixelRatio,  //设备独立像素比
                width: window.innerWidth,     //宽
                height: window.innerHeight,   //高
                cookie: document.cookie      //cookie
            };
            return info;
        },
        getCookie:function(name) {
            var arr;
            var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
            }
            else {
                return null;
            }
        },

        login:function () {
          if (!y.isWeiXin && y.isiOS) {
                if (!y.getCookie('userid')) {
                    // window.webkit.messageHandlers.interOp.postMessage(null)
                    // alert(222)
                    window.webkit.messageHandlers.interOp.postMessage('22')
                } else {

                }

            }  else  if (!y.isWeiXin) {
              if (!y.getCookie('userid')) {
                  window.myObj.LoginToMoblie();

              }



          }

        },
        regTel:function(telNumber){
            var reg = /^1\d{10}$/;
            return reg.test(telNumber.trim());
        },
        regName:function(name){
            var reg = /^[\u4e00-\u9fa5]{2,30}/;
            return reg.test(name);
        },
        regMail:function(mail){
            //邮箱的规律
            // liudehua123@126.com.cn
            // .net  gov  .china
            // * 0到多次  ? 0次或1次
            // \w  数字字母或_  +1次或多次  \表示 转义  ?0或1次
            //var regEmail1 = /^\w+[@]\w+\.\w+(\.\w+)?$/;
            //barack-obama@white-house.gov  edu
            //var regEmail = /^\w+([-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            //barack.hussein.obama.aslfkjasf@white-house-house.gov-us-us-us
            //var regEmail = /^\w+([-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            var reg = /^\w+[@]\w+\.\w+(\.\w+)?$/;
            return reg.test(mail);
        },
        //去除换行<> 字符
        filter:function(val){
           return val.replace(/[\r\n<\/>]/g, "");
        }
        // hostname: location.hostname === 'm.ufxin.com' ? true : false      //是否在正式上面
    };

    window.y = new Yl();

    if (!localStorage.getItem('mobileInfo') && !y.isPc()) {
        var info = y.getMobileInfo();
        var src = "/baseapi/yl_weberror_collect.php?action=device_model_collect&userid=" + y.getCookie('userid') + "&device_model=" + JSON.stringify(info);
        var img = document.createElement("img");

        img.setAttribute('style', "dispaly:none;opacity:0");
        img.setAttribute("src", src);
        // console.log(2)
        //因为displaynone 没有作用,添加了opacity 
        document.body.appendChild(img);
        localStorage.setItem('mobileInfo', true);
    }
    //登录星系
    if(!(location.href.indexOf('index.htm')>-1 ||
        location.href.indexOf('map')>-1)
    )
    {
        y.login();
    }

    //监听报错信息。
    window.onerror = function (err) {
        //在微信环境、在移动端，在正式上。
        if (y.isWeiXin && !y.isPc()) {
            //是否可以保存错误，默认可以
            var canSaveErr = true;
            //获取本地存储信息
            var errStr = localStorage.getItem('errStr') ? localStorage.getItem('errStr') : '{}';
            var errObj = JSON.parse(errStr);
            //单次报错信息在这里。
            var oneerrObj = {
                href: location.href,  //网址
                userAgent: y.u,    //浏览器信息，手机型号，系统
                err: err,               //错误信息
                date: new Date().toLocaleString(),    //报错时间
                ratio: window.devicePixelRatio,  //设备独立像素比
                width: window.innerWidth,     //宽
                height: window.innerHeight,   //高
                cookie: document.cookie      //cookie
            };
            //第一次报错，给errObj添加一个content属性，用来保存报错信息。
            if (!errObj.content) {
                errObj.content = [];
            }
            //报错信息跟本地信息对比，看有没有一样的。
            errObj.content.forEach(function (v, i) {
                if (oneerrObj.err === v.err) {
                    canSaveErr = false;
                    return;
                }
            });

            //判断是否可以保存新的信息，并发送信息到服务器。
            if (canSaveErr) {
                errObj.content.push(oneerrObj);
                errStr = JSON.stringify(errObj);
                localStorage.setItem('errStr', errStr);
                var src = "/baseapi/yl_weberror_collect.php?action=error_collect&userid=" + y.getCookie('userid') + "&content=" + JSON.stringify(oneerrObj);
                var script = document.createElement("script");
                script.setAttribute("src", src);
                script.setAttribute('style', "dispaly:none");
                document.body.appendChild(script);

            }
        }
    };
})(window);



