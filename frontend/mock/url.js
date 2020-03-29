import Mock from 'mockjs'
const Random = Mock.Random

export default [
  // url list
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

      var urlList = []
      var images = [1,2,3].map(x=>Random.image('200x100', Random.color(), Random.word(2,6)));
      for (var k = 0; k<8; k++) {
        var page = []
        for(var m = 0; m < 5; m++) {
          var group = []
          for (var i = 0; i < 20; i++) {
            var content = Random.cparagraph(0,10);
            group.push({
                id: i, 
                title: Random.cword(2,5),
                url: Random.domain(),
                tag: Random.cword(2,6),
                // images: images.slice(0,Random.integer(1,3))
            })
          }
          page.push({
            id: m,
            title: Random.cword(2,4),
            group: group
          })
        }
        urlList.push({
          id: k,
          title: Random.cword(4,5),
          page: page
        })
      }
      return {
        code: 20000,
        data: urlList
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
