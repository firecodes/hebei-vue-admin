import request from '@/utils/request'

export function fetchPlanBranch(query) {
  return request({
    url: '/api/plan/branch',
    method: 'get',
    params: query
  })
}
export function savePlanBranch(data) {
  return request({
    url: '/api/plan/branch',
    method: 'post',
    data
  })
}
