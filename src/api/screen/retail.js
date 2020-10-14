import request from '@/utils/request'

// 销售数据卡片
export function getCards() {
  return request({
    url: '/api/screen/resales/cards',
    method: 'get'
  })
}
// 所有零售客户级销量
export function getCustomers() {
  return request({
    url: '/api/screen/resales/customers',
    method: 'get'
  })
}

// 计划完成率
export function getPlanCompletePercent() {
  return request({
    url: '/api/screen/resales/plan/completePercent',
    method: 'get'
  })
}
// 三级单位-计划完成率
export function getPlanCompletePercentCustomer(customerId) {
  return request({
    url: `/api/screen/resales/plan/completePercent/${customerId}`,
    method: 'get'
  })
}

// 计划量与实际购气量对比
export function getPlanAndRealGasCompare() {
  return request({
    url: '/api/screen/resales/planAndRealGasCompare',
    method: 'get'
  })
}

// 三级单位-计划量与实际购气量对比
export function getPlanAndRealGasCompareCustomer(customerId, query) {
  return request({
    url: `/api/screen/resales/planAndRealGasCompare/${customerId}`,
    method: 'get',
    params: query
  })
}

// 购气类型占比
export function getPurchaseGasPercent(customerId) {
  return request({
    url: '/api/screen/resales/purchaseGasPercent',
    method: 'get'
  })
}

// 三级单位-购销气类型占比
export function getPurchaseGasPercentCustomer(customerId) {
  return request({
    url: `/api/screen/resales/purchaseGasPercent/${customerId}`,
    method: 'get'
  })
}

// 总购气量统计
export function getPurchaseStats(query) {
  return request({
    url: '/api/screen/resales/purchaseStats',
    method: 'get',
    params: query
  })
}

// 三级单位-总购气量统计
export function getPurchaseStatsCustomer(customerId, query) {
  return request({
    url: `/api/screen/resales/purchaseStats/${customerId}`,
    method: 'get',
    params: query
  })
}

// 客户零售明细
export function getCustomerDetail(name) {
  return request({
    url: `/api/screen/resales/sales/customerDetail/${name}`,
    method: 'get'
  })
}
// 总销气量统计
export function getSalesStat(query) {
  return request({
    url: '/api/screen/resales/saleStats',
    method: 'get',
    params: query
  })
}

// 三级单位 - 总销气量统计
export function getSaleStatsCustomer(customerId, query) {
  return request({
    url: `/api/screen/resales/saleStats/${customerId}`,
    method: 'get',
    params: query
  })
}
