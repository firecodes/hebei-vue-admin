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

export function passwordUpdate (data) {
  return request({
    url: '/api/system/users/updatePassword',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/api/system/users/${id}`,
    method: 'delete'
  })
}


export function login (data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

export function getInfo () {
  return request({
    url: '/api/auth/account',
    method: 'get'
  })
}

export function logout () {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}
