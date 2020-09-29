import request from '@/utils/request'

export function getReport (query) {
  return request({
    url: '/api/productReport',
    method: 'get',
    params: query
  })
}

export function createReport (data, params) {
  return request({
    url: '/api/productReport',
    method: 'post',
    data,
    params
  })
}

export function updateReport (params) {
  return request({
    url: '/api/productReport',
    method: 'put',
    params
  })
}

export function getReportRecords (params) {
  return request({
    url: '/api/productRecords',
    method: 'get',
    params
  })
}

export function getReportRecordsList (params) {
  return request({
    url: '/api/productRecords/list',
    method: 'get',
    params
  })
}

export function getReportRecordsListDetail (params) {
  return request({
    url: '/api/productRecords/list/detail',
    method: 'get',
    params
  })
}
