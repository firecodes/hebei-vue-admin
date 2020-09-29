import request from '@/utils/request'

export function uploadRecords (query) {
  return request({
    url: '/api/uploadRecords',
    method: 'get',
    params: query
  })
}

export function uploadDetail (id) {
  return request({
    url: `/api/upload/${id}`,
    method: 'get'
  })
}

export function resetPassword (id) {
  return request({
    url: `/api/system/users/resetPassword/${id}`,
    method: 'post'
  })
}

export function deleteUser (id) {
  return request({
    url: `/api/system/users/${id}`,
    method: 'delete'
  })
}
