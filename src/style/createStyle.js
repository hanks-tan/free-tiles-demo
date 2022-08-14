import {Circle, Fill, Stroke, Style, Icon } from 'ol/style'

export const createFill = (opt) => {
  return new Fill(opt)
}
export const createStroke = (opt ) => {
  return new Stroke(opt)
}

export const createCircle = (opt) => {
  return new Circle({
    radius: opt.radius,
    fill: createFill(opt.fill),
    stroke: createStroke(opt.stroke)
  })
}

export const createIcon = (opt) => {
  return new Icon(opt)
}

const create = (type, opt) => {
  switch (type) {
  case 'fill':
    return new Fill(opt)
  case 'stroke':
    return new Stroke(opt)
  case 'circle':
    return new createCircle(opt)
  case 'icon':
    return new Icon(opt)
  default:
    break
  }
}

export const createStyle = (opt) => {
  return new Style(opt)
}

export const generateStyleMap = (conf) => {
  const styleMap = {}
  Object.keys(conf).forEach((k) => {
    const v = conf[k]
    styleMap[k] = createOneStyle(v)
  })
  return styleMap
}

export const createOneStyle = (styleConf) => {
  const styleObj = {}
  Object.keys(styleConf).forEach((k) => {
    const v = styleConf[k]
    const typeStyle = create(k, v)
    if (typeStyle) {
      let type = ['circle', 'icon'].includes(k) ? 'image' : k
      styleObj[type] = typeStyle
    }
  })
  return createStyle(styleObj)
}