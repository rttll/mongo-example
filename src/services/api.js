const base = window.location.hostname === 'localhost' ? 'http://localhost:9000/api' : '/api'
const log = console.log
const dispatch = (method, url, data = {}) => {
  
  let config = { method: method }
  
  if (method !== 'GET') {
    config.body = JSON.stringify(data)
    config.headers = {
      'Content-Type': 'application/json'
    }
  }
  
  // Append {method} to the url and move any get params to the end
  let urlWithMethod = `${base}/${url.split('?')[0]}/${method.toLowerCase()}`
  urlWithMethod += `?${url.split('?').pop()}`
  // console.log(urlWithMethod)
  return fetch(urlWithMethod, config)
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