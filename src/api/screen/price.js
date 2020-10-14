import request from '@/utils/request'

// 地区详情
export function getAreaPrice(query) {
  return request({
    url: '/api/price/forecast/areaPrice',
    method: 'get',
    params: query
  })
}

// 管道天然气门站价格
export function getGatePrice(query) {
  return request({
    url: '/api/price/forecast/gatePrice',
    method: 'get',
    params: query
  })
}

// 管道天然气零售价格
export function getRetailPrice(query) {
  return request({
    url: '/api/price/forecast/retailprice',
    method: 'get',
    params: query
  })
}

// LNG 接收站销售价格
export function getLngReceive(query) {
  return request({
    url: '/api/price/forecast/lngReceive',
    method: 'get',
    params: query
  })
}

// LNG 工厂销售价格
export function getLngPlant(query) {
  return request({
    url: '/api/price/forecast/lngPlant',
    method: 'get',
    params: query
  })
}

// LNG 加气站零售价格
export function getLngRetail(query) {
  return request({
    url: '/api/price/forecast/lngRetail',
    method: 'get',
    params: query
  })
}

// CNG 车用价格
export function getCngPrice(query) {
  return request({
    url: '/api/price/forecast/cngPrice',
    method: 'get',
    params: query
  })
}

