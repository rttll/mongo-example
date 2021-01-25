const base = window.location.hostname === 'localhost' ? 'http://localhost:9000' : '/api'
const dispatch = (method, url, data = null) => {
  
  let config = { method: method }
  if ( data !== null) { config.body = JSON.stringify(data) }
  
  return fetch(`${base}/meals`)
    .then((resp) => resp.json())
    .then((json) => json)
    .catch(err => console.log)
  // return fetch(`${base}/${url}`, config)
  //   .then((resp) => resp.json())
  //   .then((json) => json)
  //   .catch(err => console.log)
}

const API = {
  get(url) {
    return dispatch('get', url)
  },
  post(url, data) {
    return dispatch('post', url, data)
  },
  patch(url, data) {
    return dispatch('patch', url, data)
  },
}

export default API