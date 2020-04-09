import Mock from 'mockjs'
const Random = Mock.Random

export default [
  // url list
  {
    url: '/url/tag',
    type: 'get',
    response: config => {
      // [ {id: 'tag'}, {id: 'tag'}, {id: 'tag'}]
      let tags = []
      // tags.push({id: 'T20200401', tag: '编程'})
      // let date = new Date()
      let base = 1586080245960
      for(let i =0; i< 20; i++) {
        tags.push({id: 'T'+base+i, title: Random.cword(2,4), color: '#409EFF'})
      }
      return {
        code: 20000,
        data: JSON.stringify(tags)
      }
    }
  },
  {
    url: '/url/list',
    type: 'get',
    response: config => {

      // mock error
      // if (!token) {
      //   return {
      //     code: 60204,
      //     message: 'Account and password are incorrect.'
      //   }
      // }
      let base = 1586080245960
      let urlList = []
      let images = [1,2,3].map(x=>Random.image('200x100', Random.color(), Random.word(2,6)));
      for (let k = 0; k<6; k++) {
        let page = []
        for(let m = 0; m < 5; m++) {
          let group = []
          for (let i = 0; i < 20; i++) {
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
      return {
        code: 20000,
        data: JSON.stringify(urlList)
      }
    }
  },

  // get user info
  // {
  //   url: '/user/info\.*',
  //   type: 'get',
  //   response: config => {
  //     const { token } = config.query
  //     const info = users[token]

  //     // mock error
  //     if (!info) {
  //       return {
  //         code: 50008,
  //         message: 'Login failed, unable to get user details.'
  //       }
  //     }

  //     return {
  //       code: 20000,
  //       data: info
  //     }
  //   }
  // },

  // user logout
  // {
  //   url: '/user/logout',
  //   type: 'post',
  //   response: _ => {
  //     return {
  //       code: 20000,
  //       data: 'success'
  //     }
  //   }
  // }
]
