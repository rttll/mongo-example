const dispatch = (method, url, data = null) => {
  let config = { method: method }
  if ( data !== null) {
    config.body = JSON.stringify(data)
  }
  return fetch(url, config)
    .then((resp) => resp.json())
    .then((json) => json)
    .catch(err => console.log)
}

const API = {
  post(url, data) {
    return dispatch('post', url, data)
  }
}

export default API