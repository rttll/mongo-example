const Realm = require('realm-web')
const Cookies = require('cookies')
const { isSameSite, signToken } = require('../lib/auth')

const app = new Realm.App({ id: process.env.REALM_APP_ID });

async function realmLogin(credentials, req, res) {
  try {
    const user = await app.logIn(credentials);
    afterLogin(user, req, res)
  } catch (error) {
    res.status(user.statusCode || 500).json({error})
  }  
}

function afterLogin(user, req, res) {
  setCookies(user, req, res)
  let { id, email, name } = user
  res.status(200).json({id, email, name})
}

function setCookies(user, req, res) {
  const cookies = new Cookies(req, res)
  let token = signToken(user)
  cookies.set('token', token, { httpOnly: true})
}

function expireCookie(req, res) {
  const cookies = new Cookies(req, res)
  cookies.set('token', '', {expires: Date.now()});
}

const actions = {
  login: (req, res) => {
    let data = req.body
    console.log('login', data)
    realmLogin(Realm.Credentials.emailPassword(data.email, data.password), req, res)
  },
  anonymous: (req, res) => {
    realmLogin(Realm.Credentials.anonymous(), req, res)
  },
  logout: async (req, res) => {
    try {
      // expireCookie(req, res)
      let app = Realm.getApp(process.env.REALM_APP_ID)
      let creds = Realm.Credentials.emailPassword('acousens@gmail.com', 'acousens')
      const user = await app.logIn(creds);
      console.log(user)
      res.status(200).json({user})
    } catch (error) {
      res.status(500).json({error})
    }
  }
}
  
module.exports = async (req, res) => {
  if ( !isSameSite(req.headers) ) res.status(401).json({})
  await actions[req.query.method](req, res)
}