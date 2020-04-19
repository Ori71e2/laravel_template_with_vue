import request from '@/utils/request'

export function getUrlList() {
  return request({
    url: '/url/getList',
    method: 'post'
  })
}

export function getUrlTag() {
  return request({
    url: '/url/getTag',
    method: 'post'
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