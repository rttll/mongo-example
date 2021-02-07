const Realm = require('realm-web')
const Cookies = require('cookies')
const { isSameSite, signToken } = require('./lib/auth')

const app = new Realm.App({ id: process.env.REALM_APP_ID });

function setCookies(token, req, res) {
  let cookies = new Cookies(req, res)
  cookies.set('token', token, { httpOnly: true})
}

async function create(data) {
  try {
    if ( data.email ) {
      return await app.emailPasswordAuth.registerUser(data.email, data.password);
    } else {
      return await app.logIn(Realm.Credentials.anonymous());
    }
  } catch (error) {
    return {error: error}
  }
};

module.exports = async (req, res) => {
  if ( !isSameSite(req.headers) ) res.status(401).json({})
  
  const user = await create(req.body)

  if ( user ) {
    if ( user.error ) {
      return res.status(user.error.statusCode).json(user.error)
    }
    
    let token = signToken(user)
    setCookies(token, req, res)
    
    let { id } = user
    res.status(200).json({id})
  } else {
    res.status(200).json({pending: true})
  }
  
}