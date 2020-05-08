import mqtt from './../../utils/mqtt.js';
var util = require('../../utils/util.js');  
//获取应用实例
const app = getApp();

Page({
    data: {
        client: null,
        topic: {
            Topic: '/message',
        },
    },

    onLoad: function (options) {
        var that = this;
        console.log("开机初始化");
        wx.setNavigationBarTitle({
            title: 'Mqtt_Demo'
        });
        
    },

    test : function(){
        var that = this;
        
        console.log("ready");
        that.data.client = app.globalData.client;
        that.data.client.on('connect', that.ConnectCallback);
        that.data.client.on("message", that.MessageProcess);
        that.data.client.on("error", that.ConnectError);
        that.data.client.on("reconnect", that.ClientReconnect);
        that.data.client.on("offline", that.ClientOffline);
    },

    onReady: function () {
        var that = this;
        console.log("ready");
        that.data.client = app.globalData.client;
        that.data.client.on('connect', that.ConnectCallback);
        that.data.client.on("message", that.MessageProcess);
        that.data.client.on("error", that.ConnectError);
        that.data.client.on("reconnect", that.ClientReconnect);
        that.data.client.on("offline", that.ClientOffline);
    },

    MessageProcess: function (topic, payload) {
        var that = this;
        var payload_string = payload.toString();
        console.log("收到的主题是：" + topic);
        console.log("内容是" + payload_string);
    },

    ConnectCallback: function (connack) {
        var that = this;
        wx.showToast({
            title: '连接成功'
        })
        for (var v in that.data.topic) {
            that.data.client.subscribe(that.data.topic[v], {
                qos: 1
            });
            console.log("订阅成功...");
        }
    },

    ConnectError: function (error) {
        console.log(error)
    },

    ClientReconnect: function () {
        console.log("Client Reconnect")
    },

    ClientOffline: function () {
        console.log("Client Offline")
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})