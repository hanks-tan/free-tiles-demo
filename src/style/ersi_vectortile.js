// 参考：
// 1. https://openlayers.org/en/latest/examples/vector-tile-info.html
// 2. https://www.arcgis.com/home/webmap/viewer.html?url=http%3A%2F%2Fcache1.arcgisonline.cn%2Farcgis%2Frest%2Fservices%2FChinaOnlineCommunityENG%2FMapServer&source=sd

export const stylesConf = {
  'Land': {
    fill: {
      color: '#fff'
    },
    stroke: {
      color: '#000',
      width: 1
    }
  },
  'Boundary line': {
    stroke: {
      color: '#ccc'
    }
  },
  'Marine area': {
    fill: {
      color: '#b0e1ff'
    }
  },
  'Road': {
    stroke: {
      color: '#ccc',
      width: 1
    }
  },
  'Water area': {
    fill: {
      color: '#b0e1ff'
    }
  }
}