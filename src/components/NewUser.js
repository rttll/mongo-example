import { useContext, useEffect, useState } from 'react'
import API from '../services/api'
import AppContext from '../services/app-context'
import { Input } from './FormElements'
import Form from './Form'
import { useHistory } from 'react-router-dom'

function Login() {
  const appHeader = useContext(AppContext)
  const history = useHistory()
  
  useEffect(() => {
    appHeader.setTitle('New Account')
  }, [])
  
  function afterSubmit(resp) {
    if (resp.status === 200) {
      if (resp.id) {
        alert('success!')
        // anonymous login
        delete resp.status
        appHeader.setUser(resp)
      } else {
        alert('success! now please log into new account')
        history.push('/login')
      }
    } else {
      alert(resp.error)
    }
  }

  return (
    <>
      <h1 className="px-4 py-2 font-medium"> Create your account </h1>
      <Form 
        action='/users'
        buttonText='Create'
        afterSubmit={afterSubmit}
      >
        <Input value="" name="email" />
        <Input value="" name="password" />
      </Form>
      <p className="text-xs">Or you can
        <a href="">login anonymously</a> to take a look around
      </p>
    </>
  )
}

export default Login