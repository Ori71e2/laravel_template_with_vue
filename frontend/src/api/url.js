import request from '@/utils/request'

export function getUrlPageList() {
  return request({
    url: '/url/list',
    method: 'get'
  })
}

export function getUrlTag() {
  return request({
    url: '/url/tag',
    method: 'get'
  })
}