var SanYueWebApp = {
  isInApp: false,
  device: "web",
  version: "",
  CALLBACK: {},
  CALLBACKID: 0,
  LISTENER: {},
  LISTENERID: 0,
  CONST: [
    'AppToActive',
    'AppToBackGround',
    'ViewInit',
    'ViewShow',
    'ViewHide',
    'NetworkType',
    'SceneMode',
    'AboutListSelect'
  ],
  NETWORLTYPES: [
    'NONE',
    'WIFI',
    'WWAN',
    '4G',
    '2G',
    '3G',
  ],
  // listen
  sub: function (key, fn) {
    var flag = false
    for (var index = 0; index < this.CONST.length; index++) {
      var element = this.CONST[index]
      if (element === key) {
        flag = true
        break
      }
    }

    if (!flag) return
    var id = (this.LISTENERID + 1) + ''
    if (!this.LISTENER.hasOwnProperty(key)) { this.LISTENER[key] = {} }
    this.LISTENER[key][id] = fn
    var that = this
    var unSub = function () {
      if (that.LISTENER.hasOwnProperty(key)) {
        that.LISTENER[key] = that.deleteObj(id, that.LISTENER[key])
      }
    }
    return unSub
  },
  pub: function (key, res, err) {
    var flag = false
    for (var index = 0; index < this.CONST.length; index++) {
      var element = this.CONST[index]
      if (element === key) {
        flag = true
        break
      }
    }
    if (!flag) return
    if (this.LISTENER.hasOwnProperty(key)) {
      var object = this.LISTENER[key]
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          var fn = object[key]
          fn(res, err)
        }
      }
    }
  },
  // api
  init: function () {
    this.checkDevice()
    // if (this.device === "web") { return }
    var metas = document.getElementsByClassName('sanyueApp')
    var config = {}
    for (var index = 0; index < metas.length; index++) {
      var obj = metas[index];
      var content
      if (isNaN(obj.content)) { content = obj.content }
      else { content = Number(obj.content) }
      config[obj.name] = content
    }
    var that = this
    this.addCallBack('SanYue_init', config, function (res) {
      that.pub('ViewInit', res)
    }, function () { })
  },
  getAppInfo: function (success, fail) {
    this.addCallBack('SanYue_getSystemInfo', null, success, fail)
  },
  showToast: function (obj) {
    var content = obj.content || ''
    var time = obj.time || 1.5
    var mask = obj.mask === undefined ? false : obj.mask
    time = time > 0 ? time : 1.5
    this.addCallBack('SanYue_showToast', { content: content, time: time, mask: mask }, null, null)
  },
  showLoad: function (obj) {
    var content = obj.content || ''
    var time = -1
    var mask = obj.mask === undefined ? false : obj.mask
    this.addCallBack('SanYue_showToast', { content: content, time: time, mask: mask }, null, null)
  },
  hiddenLoad: function () {
    this.addCallBack('SanYue_hiddenLoad', null, null, null)
  },
  setStatusStyle: function (obj) {
    var style = obj.style || 'dark'
    this.addCallBack('SanYue_setStatusStyle', { style: style }, null, null)
  },
  showModal: function (obj, success, fail) {
    var title = obj.title || '标题'
    var content = obj.content || ''
    var showCancel = obj.showCancel === undefined ? true : obj.showCancel
    var backGroundCancel = obj.backGroundCancel === undefined ? false : obj.backGroundCancel
    var cancelText = obj.cancelText || '取消'
    var confirmText = obj.confirmText || '确定'
    var cancelColor = obj.cancelColor || '#e64340'
    var confirmColor = obj.confirmColor || '#353535'
    var senseMode = obj.senseMode || 'auto' // auto , dark ，light
    var cancelColorDark = obj.cancelColorDark || '#CD5C5C'
    var confirmColorDark = obj.confirmColorDark || '#BBBBBB'
    var data = {
      title: title,
      content: content,
      showCancel: showCancel,
      cancelText: cancelText,
      confirmText: confirmText,
      backGroundCancel: backGroundCancel,
      senseMode: senseMode,
      cancelColor: cancelColor,
      confirmColor: confirmColor,
      cancelColorDark: cancelColorDark,
      confirmColorDark: confirmColorDark,
    }
    this.addCallBack('SanYue_showModal', data, success, fail)
  },
  showActionSheet: function (obj, success, fail) {
    var title = obj.title || ''
    var backGroundCancel = obj.backGroundCancel === undefined ? false : obj.backGroundCancel
    var itemColor = obj.itemColor || '#353535'
    var cancelColor = obj.cancelColor || '#e64340'
    var cancelText = obj.cancelText || '取消'
    var senseMode = obj.senseMode || 'auto' // auto , dark ，light
    var cancelColorDark = obj.cancelColorDark || '#CD5C5C'
    var itemColorDark = obj.confirmColorDark || '#BBBBBB'
    var data = {
      title: title,
      itemColor: itemColor,
      cancelColor: cancelColor,
      cancelText: cancelText,
      itemList: obj.itemList || [],
      senseMode: senseMode,
      cancelColorDark: cancelColorDark,
      backGroundCancel: backGroundCancel,
      itemColorDark: itemColorDark,
    }
    this.addCallBack('SanYue_showActionSheet', data, success, fail)
  },
  setNavBar: function (obj) {
    var statusStyle = obj.statusStyle || 'dark'
    var navBackgroundColor = obj.navBackgroundColor || '#f1f1f1'
    var title = obj.title || ''
    var titleColor = obj.titleColor || '#000000'
    var data = {
      statusStyle: statusStyle,
      navBackgroundColor: navBackgroundColor,
      title: title,
      titleColor: titleColor,
    }
    this.addCallBack('SanYue_setNavBar', data, null, null)
  },
  showPick: function (obj, success, fail) {
    if (!obj.mode) {
      fail('无效参数')
      return
    }
    var backGroundCancel = obj.backGroundCancel === undefined ? true : obj.backGroundCancel
    var mode = obj.mode
    var listenChange = obj.listenChange === undefined ? false : obj.listenChange
    var senseMode = obj.senseMode || 'auto' // auto , dark ，light
    var data = null
    switch (mode) {
      case 'normal': {
        var list = obj.list || []
        var value = obj.value || 0
        data = {
          mode: "normal",
          listenChange: listenChange,
          list: list,
          backGroundCancel: backGroundCancel,
          senseMode: senseMode,
          value: value,
        }
        break;
      }
      case 'multi': {
        var list = obj.list || []
        data = {
          mode: "multi",
          listenChange: listenChange,
          list: list,
          backGroundCancel: backGroundCancel,
          senseMode: senseMode,
          value: obj.value,
        }
        break;
      }
      case 'time': {
        var start = obj.start || '00:00'
        var end = obj.end || '23:59'
        var value = obj.value || obj.start
        data = {
          mode: "time",
          listenChange: listenChange,
          start: start,
          end: end,
          value: value,
          senseMode: senseMode,
          backGroundCancel: backGroundCancel,
        }
        break;
      }
      case 'date': {
        var start = obj.start || ''
        var end = obj.end || ''
        var value = obj.value || ''
        data = {
          mode: "date",
          listenChange: listenChange,
          start: start,
          end: end,
          value: value,
          senseMode: senseMode,
          backGroundCancel: backGroundCancel,
        }
        break;
      }
      case 'region': {
        break;
      }
    }
    this.addCallBack('SanYue_showPick', data, success, fail)
  },
  fetch: function (obj, success, fail) {
    if (!obj.method || !obj.url) {
      fail('无效参数')
      return
    }
    var data = {
      url: obj.url,
      data: obj.data,
      header: obj.header,
      method: obj.method,
    }
    var cid = this.addCallBack('SanYue_fetch', data, success, fail)
    var that = this
    var stopFetch = function () {
      that.fetchStop({ id: cid })
    }
    return stopFetch;
  },
  setClipboardData: function (obj, success, fail) {
    this.addCallBack('SanYue_setClipboardData', obj, success, fail)
  },
  getClipboardData: function (success, fail) {
    this.addCallBack('SanYue_getClipboardData', null, success, fail)
  },
  vibrateLong: function () {
    this.addCallBack("SanYue_vibrateLong", null, null, null)
  },
  vibrateShort: function () {
    this.addCallBack("SanYue_vibrateShort", null, null, null)
  },
  getNetworkType: function (success, fail) {
    this.addCallBack('SanYue_getNetworkType', null, success, fail)
  },
  navPush: function (obj, success, fail) {
    var data = {
      name: obj.name,
      extra: obj.extra || null
    }
    this.addCallBack('SanYue_navPush', data, success, fail)
  },
  navPop: function (data) {
    this.addCallBack('SanYue_navPop', data, null, null)
  },
  setPopExtra: function (data, success, fail) {
    this.addCallBack('SanYue_setPopExtra', data, success, fail)
  },
  navReplace: function (obj, success, fail) {
    var data = {
      name: obj.name,
      extra: obj.extra || null
    }
    this.addCallBack('SanYue_navReplace', data, success, fail)
  },
  restart: function (obj) {
    const clearCache = obj.clearCache === undefined ? false : obj.clearCache
    this.addCallBack("SanYue_restart", {
      clearCache
    }, null, null);
  },
  aboutList: function (obj, success, fail) {
    var backGroundCancel = obj.backGroundCancel === undefined ? false : obj.backGroundCancel
    var itemColor = obj.itemColor || '#353535'
    var cancelColor = obj.cancelColor || '#e64340'
    var cancelText = obj.cancelText || '取消'
    var senseMode = obj.senseMode || 'auto' // auto , dark ，light
    var cancelColorDark = obj.cancelColorDark || '#CD5C5C'
    var itemColorDark = obj.confirmColorDark || '#BBBBBB'
    var data = {
      title: '',
      itemColor: itemColor,
      cancelColor: cancelColor,
      cancelText: cancelText,
      itemList: obj.itemList || [],
      senseMode: senseMode,
      cancelColorDark: cancelColorDark,
      backGroundCancel: backGroundCancel,
      itemColorDark: itemColorDark,
    }
    this.addCallBack('SanYue_aboutList', data, null, null)
  },
  // help
  fetchStop: function (obj) {
    this.addCallBack('SanYue_fetch_stop', obj, null, null)
  },
  checkInApp: function (name, obj) {
    if (this.device === 'web') {
      console.log("name :" + name)
      console.log(obj)
      return false
    }
    return true
  },
  checkDevice: function () {
    var arr = navigator.userAgent.split('/')
    var isInApp = false
    var device = 'web'
    var version = 0
    if (arr.length === 3) {
      if (arr[0] === 'webApp') {
        isInApp = true
        if (arr[1] === 'ios' || arr[1] === 'android') { device = arr[1] }
        version = arr[2]
      }
    }
    this.isInApp = isInApp
    this.device = device
    this.version = version
  },
  deleteObj: function (name, obj) {
    var data = {}
    //var obj = this.CALLBACK
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) { if (name !== key) { data[key] = obj[key] } }
    }
    //this.CALLBACK = data
    return data
  },
  // 添加回调
  addCallBack: function (name, obj, success, fail) {
    if (this.checkInApp(name, obj)) {
      var cid
      if (success || fail) {
        this.CALLBACKID += 1
        var cid = this.CALLBACKID.toString()
        console.log('创建 callback ID --- ' + cid)
        var that = this
        this.CALLBACK[cid] = function (result, err, flag) {
          if (result) { if (success) { success(result) } }
          if (err) { if (fail) { fail(err) } }
          if (!flag) {
            if (that.CALLBACK[cid]) {
              //that.deleteObj(cid) 
              try {
                that.CALLBACK = that.deleteObj(cid, that.CALLBACK)
              } catch (error) {
                console.log(error)
              }
              console.log('删除 callback ID --- ' + cid)
            }
          }
        }
      }
      else {
        cid = -1
      }
      this.navtiveFunc(name, obj, cid)
      return cid
    }
    return null
  },
  // 执行 接口函数
  navtiveFunc: function (name, obj, callBackID) {
    try {

      if (this.device === 'ios') {
        window.webkit.messageHandlers[name].postMessage({ data: obj, id: callBackID })
      }
      else if (this.device === 'android') {
        AndroidNative.postMessage(JSON.stringify({ name: name, data: { data: obj, id: callBackID } }))
      }
    }
    catch (error) { console.log(error) }
  },
}
SanYueWebApp.init()