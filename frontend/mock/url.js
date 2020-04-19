import Mock from 'mockjs'
const Random = Mock.Random

// [ {id: 'tag'}, {id: 'tag'}, {id: 'tag'}]
let tags = []
// tags.push({id: 'T20200401', tag: '编程'})
// let date = new Date()
let base = 1586080245960
for(let i =0; i< 2; i++) {
  tags.push({id: 'T'+base+i, title: Random.cword(2,4), color: '#409EFF'})
}
// let base = 1586080245960
let urlList = []
let images = [1,2,3].map(x=>Random.image('200x100', Random.color(), Random.word(2,6)));
for (let k = 0; k<2; k++) {
  let page = []
  for(let m = 0; m < 2; m++) {
    let group = []
    for (let i = 0; i < 2; i++) {
      let content = Random.cparagraph(0,10);
      group.push({
          id: 'U' + base + i, 
          title: Random.cword(2,5),
          url: Random.domain(),
          tag: [],
          // images: images.slice(0,Random.integer(1,3))
      })
    }
    page.push({
      id: 'G' + base + m,
      title: Random.cword(2,4),
      group: group
    })
  }
  urlList.push({
    id: 'P' + base + k,
    title: Random.cword(4,5),
    page: page
  })
}
// [ {id: 'tag'}, {id: 'tag'}, {id: 'tag'}]
let vipTags = []
// vipTags.push({id: 'T20200401', tag: '编程'})
// let date = new Date()
// let base = 1586080245960
for(let i =0; i< 20; i++) {
  vipTags.push({id: 'T'+base+i, title: Random.cword(2,4), color: '#409EFF'})
}
// let base = 1586080245960
let vipUrlList = []

for (let k = 0; k<20; k++) {
  let page = []
  for(let m = 0; m < 2; m++) {
    let group = []
    for (let i = 0; i < 10; i++) {
      let content = Random.cparagraph(0,10);
      group.push({
          id: 'U' + base + i, 
          title: Random.cword(2,5),
          url: Random.domain(),
          tag: [],
          // images: images.slice(0,Random.integer(1,3))
      })
    }
    page.push({
      id: 'G' + base + m,
      title: Random.cword(2,4),
      group: group
    })
  }
  vipUrlList.push({
    id: 'P' + base + k,
    title: Random.cword(4,5),
    page: page
  })
}
export default [
  // url list
  {
    url: '/url/getTag',
    type: 'post',
    response: config => {
      const { token } = config.body
      if (token) {
        return {
          code: 20000,
          data: JSON.stringify(vipTags)
        }
      }
      return {
        code: 20000,
        data: JSON.stringify(tags)
      }
    }
  },
  {
    url: '/url/getList',
    type: 'post',
    response: config => {
      const { token } = config.body
      console.log(config.body)
      if (token) {
        return {
          code: 20000,
          data: JSON.stringify(vipUrlList)
        }
      }
      return {
        code: 20000,
        data: JSON.stringify(urlList)
      }
    }
  },

  // list save
  {
    url: '/url/saveList',
    type: 'post',
    response: config => {
      const list = config.body.list
      urlList = JSON.parse(list)
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // list save
  {
    url: '/url/saveTag',
    type: 'post',
    response: config => {
      const tag = config.body.tag
      tags = JSON.parse(tag)
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
