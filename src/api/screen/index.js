import request from '@/utils/request'
// 总销气量卡片
export function getCards () {
  return request({
    url: '/api/index/cards',
    method: 'get'
  })
}
// 零售-总销气量统计
export function getResalesStat (query) {
  return request({
    url: '/api/index/resales/stat',
    method: 'get',
    params: query
  })
}
// 批发-销售统计
export function getWholesalesStat (query) {
  return request({
    url: '/api/index/wholesales/stat',
    method: 'get',
    params: query
  })
}
