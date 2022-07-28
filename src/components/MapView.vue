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
          :class="{'layer-item-last': i === tileList.length - 1, 'is-vec': item.projection === '3857'}">
          {{item.name}}
        </div>
      </div>
    </div>
    <div class="map" id="map"></div>
  </div>
</template>

<script>
// 地址参考：https://blog.csdn.net/u012244479/article/details/119091013?utm_medium=distribute.pc_aggpage_search_result.none-task-blog-2~aggregatepage~first_rank_ecpm_v1~rank_v31_ecpm-3-119091013-null-null.pc_agg_new_rank&utm_term=%E5%A4%A9%E5%9C%B0%E5%9B%BE%E7%93%A6%E7%89%87%E6%8E%A5%E5%8F%A3%E8%A7%84%E5%88%99&spm=1000.2123.3001.4430
import {Map, View} from 'ol'
import TileLayer from 'ol/layer/Tile'
import { XYZ, VectorTile } from 'ol/source'
import VectorTileLayer from 'ol/layer/VectorTile'
import MVT from 'ol/format/MVT'

import { generateStyleMap } from '../style/createStyle'
import { stylesConf } from '../style/ersi_vectortile'
import TileGrid from 'ol/tilegrid/TileGrid'

import {get as getProjection, fromLonLat, toLonLat } from 'ol/proj'
// import { getWidth } from 'ol/extent'

import { apply, applyStyle } from 'ol-mapbox-style'
import * as utils from '../utils'

const projection_4490 = utils.registerProjection4490()
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
          code: 'maptiler',
          name: 'maptiler地图(需要key)',
          url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=get_your_own_D6rA4zTHduk6KOKTXzGB',
          type: 'xyz',
          projection: '3857'
        },
        {
          code: 'gaode',
          name: '高德',
          url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7',
          type: 'xyz',
          projection: '4326'
        },
        {
          code: 'gaode-raster',
          name: '高德卫星图',
          url: 'http://webst04.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          type: 'xyz',
          projection: '4326'
        },
        {
          code: 'esri-vectortile',
          name: 'arcgis矢量瓦片自定义样式',
          url: 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf',
          type: 'vector',
          projection: '3857'
        },
        {
          code: 'mapbox-vectortile',
          name: 'mapbox矢量瓦片自定义样式',
          url: 'https://api.mapbox.com/v4/mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2/{z}/{x}/{y}.vector.pbf',
          type: 'vector',
          source: 'mapbox',
          token: 'sk.eyJ1IjoiaGlrZXI3IiwiYSI6ImNsNjF2cGVueTA1NjMzYmx2YTF1cXQ4Ym4ifQ.lq1lAwf2Filwm4E_9mykmg',
          projection: '3857',
          mark: 'mapbox免费账号一天50000瓦片的限制，mapbox样式中文问题，可用再mapbox studio中修改样式来解决, 字体用name_zh_Hans'
        },
        {
          code: 'mapbox-raster',
          name: 'mapbox卫星影像',
          url: 'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.webp',
          type: 'raster',
          source: 'mapbox',
          token: 'sk.eyJ1IjoiaGlrZXI3IiwiYSI6ImNsNjF2cGVueTA1NjMzYmx2YTF1cXQ4Ym4ifQ.lq1lAwf2Filwm4E_9mykmg',
          projection: '3857',
        },
        {
          code: 'tianidtu-vectortile',
          name: '天地图矢量瓦片自定义样式',
          // url:'https://tile0.tianditu.gov.cn/province?t=vt&z={z}&x={x}&y={y}&tk=50cc4fa9dbbc4f3ca63d8db04f0aee7f',
          url: 'https://tile1.tianditu.gov.cn/vts?t=vt&z={z}&x={x}&y={y}&tk=50cc4fa9dbbc4f3ca63d8db04f0aee7f',
          type: 'vector',
          source: 'tianditu',
          projection: '4490',
          mark: 'mapbox免费账号一天50000瓦片的限制'
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
      this.view = this.createView('4326', this.center)
      const baseLayer = this.createXYZTileLayer(this.tileList[0].url)
      this.map = new Map({
        target: 'map',
        view: this.view,
        layers: [baseLayer]
      })
      this.baseLayer = baseLayer
    },
    createView (epsgCode, center = [0, 0]) {
      const view = new View({
        projection: `EPSG:${epsgCode}`,
        center: center,
        zoom: 7,
        minZoom: 1,
        maxZoom: 20
      })
      return view
    },
    createXYZTileLayer (url) {
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
      } else if(conf.source === 'mapbox') {
        if (conf.type === 'vector') {
          baseLayer = this.createMapboxVectorTile(conf)
        } else {
          baseLayer = this.createMapboxRaster(conf)
        }
      } else if (conf.source === 'tianditu') {
        baseLayer = this.createTdtVectorTile(conf)
      } else {
        baseLayer = this.createVectorTile(conf.url)
      }
      this.map.removeLayer(this.baseLayer)

      this.updateView(conf.projection)
      
      this.map.addLayer(baseLayer)
      this.baseLayer = baseLayer
    },
    createVectorTile (url) {
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
    },
    createMapboxVectorTile (config) {
      const resolutions = []
      for (let i = 0; i <= 8; ++i) {
        resolutions.push(156543.03392804097 / Math.pow(2, i * 2))
      }
      const layer = new VectorTileLayer({
        source: new VectorTile({
          format: new MVT(),
          tileGrid: new TileGrid({
            extent: getProjection('EPSG:3857').getExtent(),
            resolutions: resolutions,
            tileSize: 512
          }),
          tileUrlFunction: utils.generateTileUrlFunction(config.url, config.token),
        })
      })

      applyStyle(layer, 'mapbox://styles/hiker7/cl639a0z9001v14o6tz08tix0','', {accessToken: config.token})
      return layer
    },
    createMapboxRaster (config) {
      const resolutions = []
      for (let i = 0; i <= 25; ++i) {
        resolutions.push(156543.03392804097 / Math.pow(2, i * 2))
      }
      const layer = new TileLayer({
        source: new XYZ({
          tileGrid: new TileGrid({
            extent: getProjection('EPSG:3857').getExtent(),
            resolutions: resolutions,
            tileSize: 512
          }),
          tileUrlFunction: utils.generateTileUrlFunction(config.url, config.token),
        })
      })
      return layer
    },
    createTdtVectorTile (config) {
      var topResolution = 360.0 / 512
      const resolutions = []
      for (let i = 0; i <= 8; ++i) {
        resolutions.push(topResolution / Math.pow(2, i * 2))
      }
      const url = config.url

      const layer = new VectorTileLayer({
        source: new VectorTile({
          format: new MVT(),
          tileGrid: new TileGrid({
            extent: projection_4490.getExtent(),
            resolutions: resolutions,
            tileSize: 512
          }),
          projection: projection_4490,
          url: url
        }),
        style: (ft) => {
          if (ft.getType() === 'Point') {
            console.log(ft.getProperties())
          }
        }
      })

      return layer
    },
    updateView (epsgCode) {
      if (!epsgCode) {
        epsgCode = '4326'
      }
      const view = this.map.getView()
      const code = view.getProjection().getCode()
      if (code === `EPSG:${epsgCode}`) {
        return
      }
      if (epsgCode === '3857') {
        this.updateViewTo3857(epsgCode)
      } else if (epsgCode === '4490') {
        this.updateViewTo4490()
      } else {
        this.updateViewTo4326()
      }
    },
    updateViewTo3857 () {
      const center = this.map.getView().getCenter()
      const newCenter = fromLonLat(center)
      const view = this.createView('3857', newCenter)
      this.map.setView(view)
    },
    updateViewTo4326 () {
      const center = this.map.getView().getCenter()
      const view = this.createView('4326', toLonLat(center))
      this.map.setView(view)
    },

    updateViewTo4490 () {
      const center = this.map.getView().getCenter()
      const view = this.createView('4490', toLonLat(center))
      this.map.setView(view)
    },

    load () {
      const config = {
        token: 'sk.eyJ1IjoiaGlrZXI3IiwiYSI6ImNsNjF2cGVueTA1NjMzYmx2YTF1cXQ4Ym4ifQ.lq1lAwf2Filwm4E_9mykmg',
        url: 'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.webp'
      }
      const resolutions = []
      for (let i = 0; i <= 8; ++i) {
        resolutions.push(156543.03392804097 / Math.pow(2, i * 2))
      }
      const key = config.token
      const url = config.url
      function tileUrlFunction (tileCoord) {
        let address = `${url}?access_token=${key}`
        return address
          .replace('{z}', String(tileCoord[0] * 2 - 1))
          .replace('{x}', String(tileCoord[1]))
          .replace('{y}', String(tileCoord[2]))
          .replace(
            '{a-d}',
            'abcd'.substr(((tileCoord[1] << tileCoord[0]) + tileCoord[2]) % 4, 1)
          )
      }

      const layer = new TileLayer({
        source: new XYZ({
          // format: new MVT(),
          tileGrid: new TileGrid({
            extent: getProjection('EPSG:3857').getExtent(),
            resolutions: resolutions,
            tileSize: 512
          }),
          tileUrlFunction: tileUrlFunction,
        }),
      })

      this.map = new Map({
        target: 'map',
        view: this.createView('3857', fromLonLat(this.center)),
        layers: [layer]
      })
      this.baseLayer = layer

      // applyStyle(layer, 'mapbox://styles/hiker7/cl639a0z9001v14o6tz08tix0','', {accessToken: config.token})
      return layer
      // apply('map', 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9?access_token=sk.eyJ1IjoiaGlrZXI3IiwiYSI6ImNsNjF2cGVueTA1NjMzYmx2YTF1cXQ4Ym4ifQ.lq1lAwf2Filwm4E_9mykmg');
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
.is-vec{
  color: #03A9F4;
}
</style>