import request from '@/utils/request'

// 销售数据卡片
export function cards() {
  return request({
    url: '/api/screen/resales/cards',
    method: 'get'
  })
}
// 计划完成率
export function planCompletePercent() {
  return request({
    url: '/api/screen/resales/plan/completePercent',
    method: 'get'
  })
}
// 三级单位-计划完成率
export function planCompletePercentCustomer(customerId) {
  return request({
    url: `/api/screen/resales/plan/completePercent/${customerId}`,
    method: 'get'
  })
}

// 计划量与实际购气量对比
export function planAndRealGasCompare(code) {
  return request({
    url: '/api/screen/resales/planAndRealGasCompare',
    method: 'get'
  })
}

// 三级单位-计划量与实际购气量对比
export function planAndRealGasCompareCustomer(customerId) {
  return request({
    url: `/api/screen/resales/planAndRealGasCompare/${customerId}`,
    method: 'get'
  })
}

// 购销气类型占比
export function purchaseGasPercent(customerId) {
  return request({
    url: `/api/screen/resales/purchaseGasPercent`,
    method: 'get'
  })
}

// 三级单位-购销气类型占比
export function purchaseGasPercentCustomer(customerId) {
  return request({
    url: `/api/screen/resales/purchaseGasPercent/${customerId}`,
    method: 'get'
  })
}

// 总购气量统计
export function purchaseStats(query) {
  return request({
    url: `/api/screen/resales/purchaseStats`,
    method: 'get',
    params: query
  })
}

// 三级单位-总购气量统计
export function purchaseStatsCustomer(query) {
  return request({
    url: `/api/screen/resales/purchaseStats/${query.customerId}`,
    method: 'get',
    params: query
  })
}

// 客户零售明细
export function customerDetail(name) {
  return request({
    url: `/api/screen/resales/customerDetail/${name}`,
    method: 'get'
  })
}
// 总销气量统计
export function saleStats(query) {
  return request({
    url: `/api/screen/resales/saleStats`,
    method: 'get',
    params: query
  })
}

// 三级单位 - 总销气量统计
export function saleStatsCustomer(query) {
  return request({
    url: `/api/screen/resales/saleStats/${query.customerId}`,
    method: 'get',
    params: query
  })
}

