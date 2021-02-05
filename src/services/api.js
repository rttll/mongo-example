const log = console.log

const dispatch = (method, url, data = {}) => {  
  let config = { 
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF': 'z1pk66gvaeA83u5tSI8xqT7EPb1IuP1IOBqEQy0rZKIz6dNdI3mocJLevteM'
    }
  }
  if (method !== 'GET') { config.body = JSON.stringify(data) }

  // Append {method} to the url and move any get params to the end
  let urlWithMethod = `/api/${url.split('?')[0]}/${method.toLowerCase()}`
  urlWithMethod += `?${url.split('?').pop()}`
  
  try {
    return fetch(urlWithMethod, config)
      .then((resp) => resp.json())
      .then((json) => json)
      .catch((err) => {
        return { error: err}
      })
    } catch (err) {
    return { error: err}
  }
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