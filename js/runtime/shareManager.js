
export default class ShareManager {
  constructor() {
    this.shareTitle = '我通关了换瓶子！';
    this.shareImageUrls = [
      'images/share-img01.png',
      'images/share-img02.png',
      'images/share-img03.png',
      'images/share-img04.png',
      'images/share-img05.png'
    ]
  }

  shareToFriend(correctCount = 0, difficultyName='') {
    if (typeof wx === 'undefined') {
      console.log('非微信环境，无法分享');
      return;
    }

    wx.shareAppMessage({
      title: `我用${correctCount}步通关了${difficultyName}关卡！你能做得更好吗？`,
      imageUrl: this.getRandomShareImgUrl(),
      query: `from=friend&score=${correctCount}`,
      success: (res) => {
        console.log('分享成功', res);
        this.onShareSuccess('friend');
      },
      fail: (res) => {
        console.log('分享失败', res);
        this.onShareFail('friend');
      }
    });
  }

  shareToMoments(correctCount = 0, difficultyName='') {
    if (typeof wx === 'undefined') {
      console.log('非微信环境，无法分享');
      return;
    }

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    wx.onShareTimeline({
      title: `我用${correctCount}步通关了这个换瓶子游戏的${difficultyName}关卡！`,
      imageUrl: this.getRandomShareImgUrl(),
      query: `from=timeline&score=${correctCount}`,
      success: (res) => {
        console.log('设置朋友圈分享成功', res);
      },
      fail: (res) => {
        console.log('设置朋友圈分享失败', res);
      }
    });

    wx.showToast({
      title: '请点击右上角分享到朋友圈',
      icon: 'none',
      duration: 2000
    });
  }

  onShareSuccess(type) {
    wx.showToast({
      title: '分享成功！',
      icon: 'success',
      duration: 1500
    });
    console.log(`${type} 分享成功`);
  }

  onShareFail(type) {
    wx.showToast({
      title: '分享失败',
      icon: 'none',
      duration: 1500
    });
  }

  initShare() {
    if (typeof wx === 'undefined') return;

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    wx.onShareAppMessage(() => {
      return {
        title: this.shareTitle,
        imageUrl: this.getRandomShareImgUrl(),
        query: 'from=menu'
      };
    });

    wx.onShareTimeline(() => {
      return {
        title: this.shareTitle,
        imageUrl: this.getRandomShareImgUrl(),
        query: 'from=timeline_menu'
      };
    });
  }

  /**
   * Utils
   */
  getRandomShareImgUrl() {
    const index = Math.floor(Math.random() * this.shareImageUrls.length);
    return this.shareImageUrls[index];
  }
}
