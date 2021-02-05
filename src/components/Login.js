import { useContext, useEffect } from 'react'
import API from '../services/api'
import AppContext from '../services/app-context'


function Login() {
  const appHeader = useContext(AppContext)
  
  useEffect(() => {
    appHeader.setTitle('Login')
  }, [])
  
  function login() {
    API.post('login')
      .then((resp) => {
        if (resp.status === 200) {
          delete resp.status
          appHeader.setUser(resp)
        } else {
          console.error(resp)
        }

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