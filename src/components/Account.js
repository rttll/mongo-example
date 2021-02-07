import { useContext, useEffect } from 'react'
import AppContext from '../services/app-context'
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
      localStorage.removeItem('meal-planner-user')
      
    } else {
      // alert(resp.error)
    }
  }

  return (
    <>
      <h1 className="px-4 py-2 font-medium">Account</h1>
      <hr/>
      <Form 
        action="/sessions/logout"
        buttonText="Logout"
        afterSubmit={afterSubmit}
      >
      </Form>
    </>
  )
}

export default Login