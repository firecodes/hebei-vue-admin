import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/api/user',
    method: 'get',
    params: query
  })
}

export function createUser (data) {
  return request({
    url: '/api/user',
    method: 'post',
    data
  })
}

export function updateUser (data) {
  return request({
    url: '/api/user',
    method: 'put',
    data
  })
}

export function deleteUser (query) {
  return request({
    url: '/api/user',
    method: 'delete',
    params: query
  })
}

export function login (data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}
export function passwordReset (query) {
  return request({
    url: '/api/user/password/reset',
    method: 'put',
    params: query
  })
}
export function passwordUpdate (data) {
  return request({
    url: '/api/user/password/update',
    method: 'put',
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
