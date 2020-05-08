//index.js
//获取应用实例
const app = getApp()

//官方
// https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html
// https://blog.csdn.net/Smile_ping/article/details/102938322
// https://www.jianshu.com/p/82ee9a908543

Page({
  data: {
        status : "没有",
        sousuo_flag : "否",
        debug_msg1:"无",
        connect_lanya_name: "=caisiyu",
        connected_DeviceId:"无",
        connected_service: "无",
        connect_flag:"无连接",
        connected_CharacteristicsId:"无",
        connect_notify_flag:"没有启动",
        connect_notify_message:"",

    //   writeServicweId: "", // 可写服务uuid
    //   writeCharacteristicsId: "",//可写特征值uuid
    //   readServicweId: "", // 可读服务uuid
    //   readCharacteristicsId: "",//可读特征值uuid
      notifyServicweId: "", //通知服务UUid
      notifyCharacteristicsId: "", //通知特征值UUID
  },

    onLoad: function (options) {
        this.my_openBluetoothAdapter();

        // wx.showToast({
        //     title: '初始化成功',
        //     duration:"1000"
        // }),
        // wx.showModal({
        //     title: '',
        //     content: '',
        // })
    },

  /*
  *     第一步    打开 适配器
  */
    my_openBluetoothAdapter: function () {
        var that = this;
        wx.openBluetoothAdapter({
            success: function (res) {
                that.setData({
                    status: "打开成功"
                })
                setTimeout(function () {                    //延时1秒后开始 执行检测本机蓝牙是否可用
                    that.my_startBluetoothDevicesDiscovery();   //开始搜索蓝 牙设备
                }, 1000) //延迟时间 这里是1秒
            },
            fail: function (res) {
                that.setData({
                    status: "没有打开成功"
                })
            },
            complete: function (res) { },
        })
    },
    /*
    *     第二步    开始搜索蓝牙设备
    */
    my_startBluetoothDevicesDiscovery : function(){
        var that = this;
        wx.startBluetoothDevicesDiscovery({
            success: function(res) {
                that.setData({
                    sousuo_flag: "正在搜索",
                    debug_msg1: JSON.stringify(res),
                })
                setTimeout(function () {                    //延时1秒后开始 获取所有已发现的设备
                    that.my_getBluetoothDevices();   //获取所有已发现的设备
                }, 1000) //延迟时间 这里是1秒
            },
            fail: function (res) {
                that.setData({
                    sousuo_flag: "失败"
                })
            }
        })
    },

    /*
    *     第三步    获取所有已发现的设备
    */
    my_getBluetoothDevices: function () {
        var that = this;
        wx.getBluetoothDevices({
            success: function(res) {
                for(var i = 0;i<res.devices.length;i++){
                    if (res.devices[i].name == that.data.connect_lanya_name || res.devices[i].localName == that.data.connect_lanya_name) {
                        that.setData({
                            debug_msg1 :"发现这个设备",
                            connected_DeviceId: res.devices[i].deviceId
                        })
                        setTimeout(function () {                    //延时1秒后开始 停止搜索
                            that.my_stopBluetoothDevicesDiscovery();   //停止搜索 
                        }, 1000) //延迟时间 这里是1秒
                        // console.log("ok"+that.data.connected_DeviceId);
                        break;
                    }
                    else{
                        that.setData({
                            debug_msg1: "没有这个设备",
                            connected_DeviceId: res.devices[i].deviceId
                        })
                    }
                }
            },
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    /*
    *     第四步    停止搜索
    */
    my_stopBluetoothDevicesDiscovery :function(){
        var that = this;
        wx.stopBluetoothDevicesDiscovery({
            success: function(res) {
                that.setData({
                    sousuo_flag :"搜索结束成功"
                }),
                    setTimeout(function () {                    //延时1秒后开始 连接低功耗蓝牙设备
                    that.my_createBLEConnection();   //连接低功耗蓝牙设备 
                }, 1000) //延迟时间 这里是1秒
            },
            fail: function (res) { 
                that.setData({
                    sousuo_flag: "搜索结束失败"
                })
            },
        })
    },


    /*
    *     第五步    连接低功耗蓝牙设备--通过设备id号
    */
    my_createBLEConnection: function () {
        var that = this;
        wx.createBLEConnection({
            deviceId: that.data.connected_DeviceId,
            success: function(res) {
                that.setData({
                    connect_flag: "连接成功"
                })
                setTimeout(function () {                    //延时1秒后开始 获取蓝牙所有服务
                    that.my_getBLEDeviceServices();   //获取蓝牙所有服务 
                }, 1000) //延迟时间 这里是1秒
            },
            fail: function(res) {
                that.setData({
                    connect_flag: "连接失败"
                })
            },
            complete: function(res) {},
        })
    },

    /*
   *     第六步    获取蓝牙所有服务 ServicesID  --通过设备id号
   */
    my_getBLEDeviceServices: function () {
        var that = this;
        wx.getBLEDeviceServices({
            deviceId: that.data.connected_DeviceId,
            success: function(res) {
                console.log(res.services)
                for (var i = 0; i < res.services.length; i++) {
                    let tmpUuid = res.services[i].uuid;
                    if ((res.services[i].isPrimary) && (tmpUuid.indexOf("FFE0") != -1)) {
                        that.setData({
                            connected_service: res.services[i].uuid
                        }),
                        setTimeout(function () {                    //延时1秒后开始 获取蓝牙所有服务
                            that.my_getBLEDeviceCharacteristics();   //获取蓝牙所有服务 
                        }, 1000) //延迟时间 这里是1秒
                        return
                    }
                }
            },
            fail: function(res) {},
            complete: function(res) {},
        })
    },

    /*
   *     第七步    获取蓝牙特征值 --通过设备id号 和 connected_service
   */
    my_getBLEDeviceCharacteristics: function () {
        var that = this;
        wx.getBLEDeviceCharacteristics({            //获取蓝牙设备某个服务中所有特征值(characteristic)。
            deviceId: that.data.connected_DeviceId,
            serviceId: that.data.connected_service,
            success: function(res) {
                console.log(res.characteristics)    //打印 characteristic 
                for (var i = 0; i < res.characteristics.length; i++) {  //包含几个 characteristic
                    if (res.characteristics[i].properties.notify) {     //如果 notify 为真
                        that.setData({      
                            notifyServicweId: that.data.connected_service,
                            notifyCharacteristicsId: res.characteristics[i].uuid,   //获得 特征值
                        })
                    }
                    if (res.characteristics[i].properties.write) {       //如果 支持  write 为真
                        that.setData({
                            notifyServicweId: that.data.connected_service,
                            notifyCharacteristicsId: res.characteristics[i].uuid,
                        })
                    }
                    if (res.characteristics[i].properties.read) {   //如果 支持  read 为真
                        that.setData({
                            notifyServicweId: that.data.connected_service,
                            notifyCharacteristicsId: res.characteristics[i].uuid,
                        })
                    }
                    setTimeout(function () {                    //延时1秒后开始 启用低功耗蓝牙设备特征值变化
                        that.my_notifyBLECharacteristicValueChange();   //启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值 
                    }, 1000) //延迟时间 这里是1秒
                }
                that.setData({
                    connected_CharacteristicsId: JSON.stringify(res.characteristics),
                })
            },
            fail: function(res) {
                console.log("res33232")
            },
            complete: function(res) {}
        })
    },
     /*
        *     第八步    启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。
    */
    my_notifyBLECharacteristicValueChange:function(){
        var that = this;
        wx.notifyBLECharacteristicValueChange({
            deviceId: that.data.connected_DeviceId,
            serviceId: that.data.connected_service,
            characteristicId: that.data.notifyCharacteristicsId,
            state: true,            //是否启用notify
            success: function(res) {
                that.setData({
                    connect_notify_flag: "启动成功"
                })

                //读取低功耗蓝牙设备的特征值的二进制数据值。
                wx.onBLECharacteristicValueChange(function(res){            //这个是监听 数据过来的
                    that.setData({
                        connect_notify_message: that.buf_To_string(res.value)  //将buf 转变成字符串
                    })
                })
            },
            fail: function(res) {
                that.setData({
                    connect_notify_flag: "启动失败"
                })
            },
            complete: function(res) {},
        })
    },

    //发送  
    lanya1: function () {
        var that = this;
        console.log('characteristic value changed:1')
        var buf = this.stringToBytes("niubi-caisiyu")
        wx.writeBLECharacteristicValue({
            deviceId: that.data.connected_DeviceId,
            serviceId: that.data.connected_service,
            characteristicId: that.data.notifyCharacteristicsId,
            value: buf,
            success: function(res) {
                console.log('characteristic okokok changed:1')
            },
            fail: function(res) {},
            complete: function(res) {},
        })
    },

    btn_Connect:function(){
        this.my_openBluetoothAdapter();
    },

    btn_Disconnect:function(){
        var that = this;
        wx.closeBLEConnection({
            deviceId: that.data.connected_DeviceId,
            success: function (res) {
                that.setData({
                    status: "没有",
                    sousuo_flag: "否",
                    debug_msg1: "无",
                    // connect_lanya_name: "=caisiyu",
                    connected_DeviceId: "无",
                    connected_service: "无",
                    connect_flag: "无连接",
                    connected_CharacteristicsId: "无",
                    connect_notify_flag: "没有启动",
                    connect_notify_message: "",
                    notifyServicweId: "", //通知服务UUid
                    notifyCharacteristicsId: "", //通知特征值UUID
                })
            }
        })
    },

    // 字符串转byte
    stringToBytes :function (str) {
        var array = new Uint8Array(str.length);
        for(var i = 0, l = str.length; i<l; i++) {
            array[i] = str.charCodeAt(i);
        }
    // console.log(array);
        return array.buffer;
    } ,

    /*转换成需要的格式*/
    buf_To_string(buffer) {
        var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
        return arr.map((char, i) => {
            return String.fromCharCode(char);
        }).join('');

    },


  /**
   * 生命周期函数--监听页面加载
   */
  

    
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

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
