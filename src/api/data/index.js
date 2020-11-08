import request from '@/utils/request'

// 数据中心-零售业务
export function getResaleDataByCustomer(query) {
  return request({
    url: '/api/datacenter/resale',
    method: 'get',
    params: query
  })
}

export function getResaleMonthStyle(query){
  return request({
    url: '/api/datacenter/resale/month',
    method: 'get',
    params: query
  })
}

// 数据中心-批发业务
export function getWholeSalesDataByCustomer(query) {
  return request({
    url: '/api/datacenter/sales',
    method: 'get',
    params: query
  })
}
// CNG 车用价格
export function getCngPrice(query) {
  return request({
    url: '/api/datacenter/price/forecast/cngPrice',
    method: 'get',
    params: query
  })
}

// 管道天然气门站价格
export function getGatePrice(query) {
  return request({
    url: '/api/datacenter/price/forecast/gatePrice',
    method: 'get',
    params: query
  })
}
// LNG 工厂销售价格
export function getLngPlant(query) {
  return request({
    url: '/api/datacenter/price/forecast/lngPlant',
    method: 'get',
    params: query
  })
}

// LNG 接收站销售价格
export function getLngReceive(query) {
  return request({
    url: '/api/datacenter/price/forecast/lngReceive',
    method: 'get',
    params: query
  })
}

// LNG 加气站零售价格
export function getLngRetail(query) {
  return request({
    url: '/api/datacenter/price/forecast/lngRetail',
    method: 'get',
    params: query
  })
}

// 管道天然气零售价格
export function getRetailPrice(query) {
  return request({
    url: '/api/datacenter/price/forecast/retailprice',
    method: 'get',
    params: query
  })
}
