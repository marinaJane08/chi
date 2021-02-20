export default {
  pages: [
    'pages/tree/index',//「🌲」
    'pages/panel/index',//「面板」
    'pages/panel/unified/index',//统一仓库
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
      { pagePath: 'pages/tree/index', text: '🌲' },
      { pagePath: 'pages/panel/index', text: '面板' },
      { pagePath: 'pages/login/index', text: '我' },
    ]
  }
}
