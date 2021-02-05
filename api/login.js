const Realm = require('realm-web')
const Cookies = require('cookies')
const { isSameSite, signToken } = require('./lib/auth')

const app = new Realm.App({ id: process.env.REALM_APP_ID });

const loginAnonymous = async () => {
  return await app.logIn(Realm.Credentials.anonymous());
};

function setCookies(token, req, res) {
  let cookies = new Cookies(req, res)
  cookies.set('token', token, { httpOnly: true})
}

module.exports = async (req, res) => {
  if ( !isSameSite(req.headers) ) res.status(401).json({})
  const user = await loginAnonymous()
  if ( user ) {
    let token = signToken(user)
    setCookies(token, req, res)
    res.status(200).json({token})
  } else {
    console.log('errr user noooo')
  }
}