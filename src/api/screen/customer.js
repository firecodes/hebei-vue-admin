import request from '@/utils/request'

// 总销气量卡片
export function getCustomersCard() {
  return request({
    url: '/api/screen/customers/card',
    method: 'get'
  })
}

// 客户量卡片
export function getCustomersCount() {
  return request({
    url: '/api/screen/customers/count',
    method: 'get'
  })
}
// 地区客户明细
export function getCustomersAreaDetail() {
  return request({
    url: '/api/screen/customers/sales/areaDetail',
    method: 'get'
  })
}

// // 客户销售下降
// export function getCustomersDecrease() {
//   return request({
//     url: '/api/screen/customers/sales/decrease',
//     method: 'get'
//   })
// }
// // 客户销售增长
// export function getCustomersIncrease() {
//   return request({
//     url: '/api/screen/customers/sales/increase',
//     method: 'get'
//   })
// }
// 客户销售TOP10
export function getCustomersTop() {
  return request({
    url: '/api/screen/customers/sales/top',
    method: 'get'
  })
}

// 合同量top10
export function getCustomersContractTop() {
  return request({
    url: '/api/screen/customers/contract/top',
    method: 'get'
  })
}

// 客户年销售top10
export function getCustomersYearSalesTop() {
  return request({
    url: '/api/screen/customers/sales/year/top',
    method: 'get'
  })
}


// 客户量统计
export function getCustomersStats() {
  return request({
    url: '/api/screen/customers/stats',
    method: 'get'
  })
}
