
import API from '../services/api'

function Login() {

  function login() {
    API.post('login')
      .then((resp) => {
        // todo save username
        console.log(resp)
      })
      .catch(console.error)
  }

  return (
    <>
      <h1>Login</h1>
      <button className="p-4 bg-purple-100" onClick={login}>Log In</button>
    </>
  )
}

export default Login