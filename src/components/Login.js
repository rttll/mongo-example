import { useContext, useEffect, useState } from 'react'
import API from '../services/api'
import AppContext from '../services/app-context'
import { Input } from './FormElements'
import Form from './Form'

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

  function emailLogin() {
    console.log()
  }

  

  return (
    <>
      <h1>Login</h1>
      <Form action="/login">
        <Input value="" name="email" />
        <Input value="" name="password" />
      </Form>
      {/* <button className="p-4 bg-purple-100" onClick={login}>Log In</button> */}
    </>
  )
}

export default Login