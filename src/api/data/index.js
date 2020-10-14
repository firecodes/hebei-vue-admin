import request from '@/utils/request'

// 数据中心-零售业务
export function getResaleDataByCustomer(query) {
  return request({
    url: '/api/datacenter/resale',
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
