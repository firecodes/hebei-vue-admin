import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/system/users',
    method: 'get',
    params: query
  })
}

export function saveUser(data) {
  return request({
    url: '/api/system/users',
    method: 'post',
    data
  })
}

export function resetPassword(id) {
  return request({
    url: `/api/system/users/resetPassword/${id}`,
    method: 'post'
  })
}

export function deleteUser(id) {
  return request({
    url: `/api/system/users/${id}`,
    method: 'delete'
  })
}
