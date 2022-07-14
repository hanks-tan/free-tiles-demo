<template>
  <div > 
    <div class="layer-switch">
      <button 
        v-show="!showLayerSwitch"
        @click="showLayerSwitch = true">
        切换底图
      </button>
      <div v-show="showLayerSwitch">
        <div 
          v-for="item in tileList" 
          :key="item.code" 
          @click="changeBaseLayer(item)"
          class="layer-item">{{item.name}}</div>
      </div>
    </div>
    <div class="map" id="map">

    </div>
  </div>
</template>

<script>
import {Map,  View} from 'ol'
import TileLayer from 'ol/layer/Tile'
import { XYZ } from 'ol/source'
export default {
  data () {
    return {
      map: null,
      view: null,
      center: [113, 32],
      tileList: [
        {
          code: 'geoq_',
          name: '智图暖色版',
          url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}',
          type: 'xyz'
        },
        {
          code: 'geoq_dark',
          name: '智图深色版',
          url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
          type: 'xyz'
        },
        {
          code: 'geoq_Gray',
          name: '智图灰色版',
          url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}',
          type: 'xyz'
        },
        {
          code: 'esri_raster',
          name: 'arcgis影像',
          url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          type: 'xyz'
        },
        {
          code: 'esri_elevation',
          name: 'arcgis地形',
          url: 'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}',
          type: 'xyz'
        },
        {
          code: 'esri_elevation_Dark',
          name: 'arcgi黑色地形',
          url: 'http://server.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade_Dark/MapServer/tile/{z}/{y}/{x}',
          type: 'xyz'
        },
        {
          code: 'esri_elevation_Dark',
          name: 'arcgi黑色',
          url: ' http://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          type: 'xyz'
        },
        {
          code: 'weather',
          name: 'weather网站底图',
          url: 'https://tiles.windy.com/tiles/v9.0/darkmap/{z}/{x}/{y}.png',
          type: 'xyz'
        },
      ],
      showLayerSwitch: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.view = this.createView('4326')
      const baseLayer = this.createXYZTileLayer(this.tileList[0].url)
      this.map = new Map({
        target: 'map',
        view: this.view,
        layers: [baseLayer]
      })
      this.baseLayer = baseLayer
    },
    createView (epsgCode) {
      const view = new View({
        projection: `EPSG:${epsgCode}`,
        center: this.center,
        zoom: 7,
        minZoom: 1,
        maxZoom: 20
      })
      return view
    },
    createXYZTileLayer(url) {
      const source = new XYZ({
        url: url
      })
      const layer = new TileLayer({
        source: source
      })
      return layer
    },
    changeBaseLayer (conf) {
      let baseLayer
      if (conf.type === 'xyz') {
        baseLayer = this.createXYZTileLayer(conf.url)
      }
      this.map.removeLayer(this.baseLayer)
      this.map.addLayer(baseLayer)
      this.baseLayer = baseLayer
    },
    createVectorTile() {
      
    }
  }
}
</script>

<style lang="css" scoped>
.map{
  height: 100vh;
  width: 100%;
}
.layer-switch{
  position: absolute;
  left: 1rem;
  top: 1rem;
  z-index: 1;
  border: 1px solid #666;
  background-color: #fff;
  padding: 10px;
  border-radius: 3px;
}
.layer-switch button{

}
.layer-item{
  padding: 5px 0;
  cursor: pointer;
}
</style>