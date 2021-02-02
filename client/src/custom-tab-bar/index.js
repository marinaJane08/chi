Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/pages/panel/index",
      iconPath: "./icon_component.png",
      selectedIconPath: "./icon_component_HL.png",
      text: "面板"
    }, {
      pagePath: "/pages/relation/index",
      iconPath: "./icon_API.png",
      selectedIconPath: "./icon_API_HL.png",
      text: "首页"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})
