// miniprogram/pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    username: ''
  },

  bindGetUserInfo(e) {
    let self = this;
    console.log(e);
    if (e.detail.userInfo) {
      console.log("点击了同意授权");
      wx.login({
        success: function (res) {
          console.log(""+e.detail.userInfo.nickName)
          self.setData({
            username: e.detail.userInfo.nickName
          })
          // 调用云函数
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              console.log('[云函数] [login] user openid: ', res.result.openid)
              self.setData({
                openid: res.result.openid,
              })

              //将用户信息提交至数据库
              const db = wx.cloud.database()
              db.collection('UserTable').add({
                data: {
                  username: self.data.username,
                  openid: self.data.openid,
                  isLogin: 'true'
                },
                success: res => {
                  wx.showToast({
                    title: '登陆成功',
                  })
                  //将用户信息存在本地
                  wx.setStorageSync('login', 'true')
                  wx.setStorageSync('username', self.data.username)
                  wx.setStorageSync('login', self.data.openid)

                  //页面跳转
                  wx.redirectTo({
                    url: '../charaList/charaList',
                  })

                },
                fail: err => {
                  wx.showToast({
                    icon: 'none',
                    title: '登录失败'
                  })
                }
              })

            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
              
            }
          })
        }
      })
    } else {
      console.log("点击了拒绝授权");
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync('login')==='true'){
      wx.redirectTo({
        url: '../charaList/charaList',
      })
    }
  },

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