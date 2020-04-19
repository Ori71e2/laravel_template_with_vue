const jwt = require('jsonwebtoken')

/*
  iss (issuer)：签发人
  exp (expiration time)：过期时间
  sub (subject)：主题
  aud (audience)：受众
  nbf (Not Before)：生效时间
  iat (Issued At)：签发时间
  jti (JWT ID)：编号
  ++++++++++++++++++++++++++
  iss:签发人
  iat:签发时间回溯30s
  exp:过期时间 这里可是使用秒数,也可以使用day
  "{"jti":1,"iss":"gumt.top","user":"goolge","iat":1555650413,"exp":1555657613}"
  "iat": ~~(Date.now() / 1000)-30,
  "exp": ~~(Date.now() / 1000)+(60*60),
*/
const userJwtOptions = {
  "jti": 1,
  "iss": "Ori71e2",
  "sub": "nav",
  "user": "Ori71e2",
  "aud": "http://localhost",
  "iat": ~~(Date.now() / 1000) - 30,
  "exp": ~~(Date.now() / 1000) + (60*60)
}
const privateKey = "11111111"

const JWTOKEN = jwt.sign(userJwtOptions, privateKey)

const users = {}
users[JWTOKEN] = {
  introduction: 'I am a super administrator',
  name: 'Super Admin'
}
export default [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username, password } = config.body
      const token = JWTOKEN
      // console.log(config.body)
      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },
  // 按理来说，可以不需要传递username参数，登录成功后token为唯一用户凭证
  {
    url: '/user/verify',
    type: 'post',
    response: config => {
      const { username, code } = config.body
      if (code !== 8888) {
        return {
          code: 60204,
          message: 'bad verification code'
        }
      }

      return {
        code: 20000,
        data: true
      }
    }
  },

  // get user info
  {
    url: '/user/info',
    type: 'post',
    response: config => {
      const { token } = config.body
      const info = users[token]
      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
