import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import { Projection, addProjection } from 'ol/proj'

/**
 * 注册CGCS2000坐标系(4490)
 * @returns 
 */
export function registerProjection4490 () {
  // proj4.defs("EPSG:4490","GEOGCS[\"China Geodetic Coordinate System 2000\",DATUM[\"China_2000\",SPHEROID[\"CGCS2000\",6378137,298.257222101,AUTHORITY[\"EPSG\",\"1024\"]],AUTHORITY[\"EPSG\",\"1043\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4490\"]]");
  proj4.defs('EPSG:4490','+proj=longlat +ellps=GRS80 +no_defs')
  register(proj4)

  const projection_4490 = new Projection({
    code: 'EPSG:4490',
    units: 'degrees',
    axisOrientation: 'neu'
  })

  projection_4490.setExtent([-180, -90, 180, 90])
  projection_4490.setWorldExtent([-180, -90, 180, 90])
  addProjection(projection_4490)

  return projection_4490
}

/**
 * 生成mapbox瓦片地址规则
 * @param {*} url 
 * @param {*} key 
 * @returns 
 */
export function generateTileUrlFunction (url, key) {
  return function tileUrlFunction (tileCoord) {
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
}