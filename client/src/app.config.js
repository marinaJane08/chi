export default {
  pages: [
    'pages/panel/index',//「面板」
    'pages/panel/unified/index',//统一仓库
    'pages/relation/index',//「首页」
    'pages/me/index',//「我」
    'pages/login/index',//登录
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '嘟噜',
    navigationBarTextStyle: 'black'
  },
  cloud: true,
  tabBar: {
    // "custom": true,
    // "color": "#7A7E83",
    // "selectedColor": "#3cc51f",
    list: [
      { pagePath: 'pages/panel/index', text: '面板' },
      { pagePath: 'pages/relation/index', text: '首页' },
      { pagePath: 'pages/me/index', text: '我' },
    ]
  }
}
