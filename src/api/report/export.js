import request from '@/utils/request'
// 日简报
export function exportDayReport(query) {
  return request({
    url: '/api/export/day',
    method: 'get',
    params: query
  })
}

// 河北分公司销售报表
export function exportSales(query) {
  return request({
    url: '/api/export/sales',
    method: 'get',
    params: query
  })
}

// 昆仑批发
export function exportWholeSales(query) {
  return request({
    url: '/api/export/wholeSales',
    method: 'get',
    params: query
  })
}
// 自有终端
export function exportSelfTerminal(query) {
  return request({
    url: '/api/export/selfTerminal',
    method: 'get',
    params: query
  })
}

//   周对比及分日
export function exportWeekReport(query) {
  return request({
    url: '/api/export/week',
    method: 'get',
    params: query
  })
}

// 冀东LNG
export function exportLngReport(query) {
  return request({
    url: '/api/export/lng',
    method: 'get',
    params: query
  })
}
// 实时年
export function exportYearReport(query) {
  return request({
    url: '/api/export/year',
    method: 'get',
    params: query
  })
}
// 月对比及分日
export function exportMonthReport(query) {
  return request({
    url: '/api/export/month',
    method: 'get',
    params: query
  })
}









