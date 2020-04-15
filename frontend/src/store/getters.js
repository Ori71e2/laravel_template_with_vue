const getters = {
  token: state => state.user.token,
  name: state => state.user.name,
  urlList: state => state.url.list
}
export default getters
