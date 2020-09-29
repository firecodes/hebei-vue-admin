import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/role',
    method: 'get',
    params: query
  })
}
