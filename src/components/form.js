import { isValidElement, cloneElement } from 'react'
import { useState } from 'react'
import API from '../services/api'

function Form(props) {
  const [data, setData] = useState({})

  let inputs;
  if ( props.children ) {
    inputs = props.children.map((child, i) => {
      if ( isValidElement(child) ) {
        return cloneElement(child, {onChange: inputChanged, key: i})
      }      
    })
  }

  function inputChanged(event) {
    const { name, value } = event.target
    setData((currentData) => ({
      ...currentData, [name]: value
    }))
  }

  function send(e) {
    e.preventDefault()
    API.post(props.action, data)
      .then((resp) => {
        props.afterSubmit(resp)
      })
      .catch(console.error)
  }

  return (
    <form onSubmit={send} className="p-4 space-y-2">
      { props.children && inputs }
      <div className="flex justify-end">
        <button className="p-4 py-2 text-xs text-white bg-purple-700 rounded-full">
          {props.buttonText || 'Save'}
        </button>
      </div>
    </form>
  )
}

export default Form