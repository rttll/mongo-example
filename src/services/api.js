const base = window.location.hostname === 'localhost' ? 'http://localhost:9000' : '/api'

const dispatch = (method, url, data = null) => {
  
  let config = { method: method }
  if ( data !== null) { 
    config.body = JSON.stringify(data) 
    config.headers = {
      'Content-Type': 'application/json'
    }
  }
  console.log('api', config)
  return fetch(`${base}/${url}`, config)
    .then((resp) => resp.json())
    .then((json) => json)
    .catch(err => console.error('errr', err))
}

const API = {
  get(url) {
    return dispatch('GET', url)
  },
  post(url, data) {
    return dispatch('POST', url, data)
  },
  patch(url, data) {
    return dispatch('PATCH', url, data)
  },
  delete(url, data) {
    return dispatch('DELETE', url, data)
  },
}

export default API