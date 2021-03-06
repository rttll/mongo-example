import { useContext, useEffect } from 'react'
import AppContext from '../services/app-context'
import { Input } from './FormElements'
import Form from './Form'
import { useHistory } from 'react-router-dom'

function Login() {
  const appHeader = useContext(AppContext)
  const history = useHistory()
  
  useEffect(() => {
    appHeader.setTitle('Login')
  }, [])
  
  function afterSubmit(resp) {
    if (resp.status === 200) {
      if (resp.id) {
        delete resp.status
        appHeader.setUser(resp)
        history.push('/')
      }
    } else {
      alert(resp.error)
    }
  }

  return (
    <>
      <h1 className="px-4 py-2 font-medium">Login</h1>
      <Form 
        action="/sessions/login"
        buttonText="Login"
        afterSubmit={afterSubmit}
      >
        <Input value="" name="email" />
        <Input value="" name="password" />
      </Form>
    </>
  )
}

export default Login