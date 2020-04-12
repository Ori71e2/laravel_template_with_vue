import request from '@/utils/request'

export function getUrlList() {
  return request({
    url: '/url/getList',
    method: 'get'
  })
}

export function getUrlTag() {
  return request({
    url: '/url/getTag',
    method: 'get'
  })
}

export function saveUrlList(list) {
  return request({
    url: '/url/saveList',
    method: 'post',
    data: { list }
  })
}

export function saveUrlTag(tag) {
  return request({
    url: '/url/saveTag',
    method: 'post',
    data: { tag }
  })
}