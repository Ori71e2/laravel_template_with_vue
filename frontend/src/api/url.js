import request from '@/utils/request'

export function getUrlPageList() {
  return request({
    url: '/url/list',
    method: 'get'
  })
}
