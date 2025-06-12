
export default class ShareManager {
  constructor() {
    this.shareTitle = '我通关了这个有趣的游戏！';
    this.shareImageUrl = 'images/share-image.jpg'; // 需要准备分享图片
  }

  // 分享给朋友
  shareToFriend(correctCount = 0) {
    if (typeof wx === 'undefined') {
      console.log('非微信环境，无法分享');
      return;
    }

    wx.shareAppMessage({
      title: `我用${correctCount}步通关了！你能做得更好吗？`,
      imageUrl: this.shareImageUrl,
      query: `from=friend&score=${correctCount}`, // 可以传递参数
      success: (res) => {
        console.log('分享成功', res);
        // 可以给用户一些奖励
        this.onShareSuccess('friend');
      },
      fail: (res) => {
        console.log('分享失败', res);
        this.onShareFail('friend');
      }
    });
  }

  // 分享到朋友圈（需要先设置分享到朋友圈的内容）
  shareToMoments(correctCount = 0) {
    if (typeof wx === 'undefined') {
      console.log('非微信环境，无法分享');
      return;
    }

    // 设置分享到朋友圈的内容
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    wx.onShareTimeline({
      title: `我用${correctCount}步通关了这个有趣的游戏！`,
      imageUrl: this.shareImageUrl,
      query: `from=timeline&score=${correctCount}`,
      success: (res) => {
        console.log('设置朋友圈分享成功', res);
      },
      fail: (res) => {
        console.log('设置朋友圈分享失败', res);
      }
    });

    // 提示用户点击右上角分享
    wx.showToast({
      title: '请点击右上角分享到朋友圈',
      icon: 'none',
      duration: 2000
    });
  }

  // 分享成功回调
  onShareSuccess(type) {
    wx.showToast({
      title: '分享成功！',
      icon: 'success',
      duration: 1500
    });
    
    // 这里可以给用户奖励，比如额外的提示次数等
    console.log(`${type} 分享成功，可以给用户奖励`);
  }

  // 分享失败回调
  onShareFail(type) {
    wx.showToast({
      title: '分享失败',
      icon: 'none',
      duration: 1500
    });
  }

  // 初始化分享设置（在游戏启动时调用）
  initShare() {
    if (typeof wx === 'undefined') return;

    // 显示分享菜单
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    // 设置默认分享内容（用户点击右上角分享时）
    wx.onShareAppMessage(() => {
      return {
        title: this.shareTitle,
        imageUrl: this.shareImageUrl,
        query: 'from=menu'
      };
    });

    // 设置朋友圈分享内容
    wx.onShareTimeline(() => {
      return {
        title: this.shareTitle,
        imageUrl: this.shareImageUrl,
        query: 'from=timeline_menu'
      };
    });
  }
}
