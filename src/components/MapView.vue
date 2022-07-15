<template>
  <div > 
    <div class="layer-switch">
      <div class="sw">
        <i class="iconfont"
          :class="{'icon-arrow-up-bold':showLayerSwitch, 'icon-arrow-down':!showLayerSwitch}"
          @click="showLayerSwitch = !showLayerSwitch">
        </i>
      </div>
      <div v-show="showLayerSwitch" class="main">
        <div 
          v-for="(item,i) in tileList" 
          :key="item.code" 
          @click="changeBaseLayer(item)"
          class="layer-item"
          :class="{'layer-item-last': i === tileList.length - 1}">
          {{item.name}}
        </div>
      </div>
    </div>
    <div class="map" id="map"></div>
  </div>
</template>

<script>
import {Map,  View} from 'ol'
import TileLayer from 'ol/layer/Tile'
import { XYZ, VectorTile } from 'ol/source'
import VectorTileLayer from 'ol/layer/VectorTile'
import MVT from 'ol/format/MVT'

import { generateStyleMap } from '../style/createStyle'
import { stylesConf } from '../style/ersi_vectortile'

const styles = generateStyleMap(stylesConf)
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
          code: 'esri_Dark',
          name: 'arcgi黑色矢量',
          url: ' http://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          type: 'xyz'
        },
        {
          code: 'weather',
          name: 'weather网站底图',
          url: 'https://tiles.windy.com/tiles/v9.0/darkmap/{z}/{x}/{y}.png',
          type: 'xyz'
        },
        {
          code: 'esri-vectortile',
          name: 'arcgis黑色地形',
          url:'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf',
          type: 'vector'
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
      } else if (conf.type === 'vector') {
        baseLayer = this.createVectorTile(conf.url)
      }
      this.map.removeLayer(this.baseLayer)
      this.map.addLayer(baseLayer)
      this.baseLayer = baseLayer
    },
    createVectorTile(url) {
      const layer = new VectorTileLayer({
        source: new VectorTile({
          format: new MVT(),
          url: url,
          projection: 'EPSG:4326'
        }),
        style: function (ft) {
          const type = ft.get('layer')
          return styles[type]
        }
      })
      return layer
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
  border: 1px solid #d7d7d7;
  background-color: #fff;
  padding: 5px;
  border-radius: 3px;
}
.main{
  margin: 0 5px;
}
.layer-item{
  margin-top: 5px;
  cursor: pointer;
  border-bottom: 1px solid #c8c8c8;
  text-align: left;
}
.layer-item-last{
  border: 0;
}
.sw{
  text-align:center;
  height: 16px;
  cursor: pointer;
  color: #03A9F4;
}
</style>