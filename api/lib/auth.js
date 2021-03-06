const Cookies = require('cookies')
const jwt = require('jsonwebtoken');

if ( process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const jwtKey = process.env.JWT_KEY

function signToken(user) {
  return jwt.sign({ 
    user: {
      id: user.id,
      access: user._accessToken,
      refresh: user._refreshToken
    }
  }, jwtKey)
}

function isSameSite(headers) {
  return headers['x-csrf'] === process.env.CSRF
}

// let header = req.headers.authorization
// if ( /^Bearer\s.*/g.test(header) ) {
//   let token = header.replace(/^Bearer\s/, '')

function _verifyToken(req, res) {
  let cookies = new Cookies(req, res)
  try {
    return jwt.verify(cookies.get('token'), jwtKey)
  } catch (error) {
    return false;
  }
}

function authorize(req) {
  return isSameSite(req.headers) && _verifyToken(req)
}

module.exports = { authorize, signToken, isSameSite }