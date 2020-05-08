//app.js
import mqtt from './utils/mqtt.js';

//设置变量
const host = 'wxs://te7ydpm.mqtt.iot.gz.baidubce.com:443/mqtt';   //host
// const host = 'wxs://118.178.59.37/mqtt';   //host
const options = {
    protocolVersion: 4, //MQTT连接协议版本
    clientId: randomString(5),  //随机ID
    clean: true,
    username: 'te7ydpm/caisiyu',
    password: 'xZp9QEdOQ7C8giy6',
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    resubscribe: true
};

App({
    /**
     * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
     */
    onLaunch: function () {
        console.log("我是外面的 js，初始化完成后");
    },

    globalData: {
        // client_ID: "caisiyu_WeChat",
        client: mqtt.connect(host, options),
    },

    /**
     * 当小程序启动，或从后台进入前台显示，会触发 onShow
     */
    onShow: function (options) {
        console.log("我是外面的 js");
    },

    /**
     * 当小程序从前台进入后台，会触发 onHide
     */
    onHide: function () {

    },

    /**
     * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
     */
    onError: function (msg) {

    }
})

function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
