import request from '@/utils/request'

// 计划完成率
export function getPlanCompletePercent() {
  return request({
    url: '/api/screen/wholesales/plan/completePercent',
    method: 'get'
  })
}

// 客户-合同、计划&今日量
export function getSalesCustomerItems(code) {
  return request({
    url: `/api/screen/wholesales/sales/${code}/customer/items`,
    method: 'get'
  })
}

// 地区销售数据
export function getSalesArea(code) {
  return request({
    url: `/api/screen/wholesales/sales/area/${code}`,
    method: 'get'
  })
}

// 地区-客户销售排名
export function getSalesAreaCustomerSorted(code) {
  return request({
    url: `/api/screen/wholesales/sales/area/customerSorted/${code}`,
    method: 'get'
  })
}

// 地区销售明细
export function getSalesAreaDetail(query) {
  return request({
    url: '/api/screen/wholesales/sales/areaDetail',
    method: 'get',
    params: query
  })
}
// 地区销售排名
export function getSalesAreaSorted() {
  return request({
    url: '/api/screen/wholesales/sales/areaSorted',
    method: 'get'
  })
}

// 销售数据卡片
export function getCards() {
  return request({
    url: '/api/screen/wholesales/sales/card',
    method: 'get'
  })
}

// 客户销售明细
export function getSalesCustomer(id) {
  return request({
    url: `/api/screen/wholesales/sales/customer/${id}`,
    method: 'get'
  })
}

// 管道气销售
export function getSalesPipelineGas(query) {
  return request({
    url: '/api/screen/wholesales/sales/pipelineGas',
    method: 'get',
    params: query
  })
}

// 销售统计
export function getSalesStat(query) {
  return request({
    url: '/api/screen/wholesales/sales/stat',
    method: 'get',
    params: query
  })
}

