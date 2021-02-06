import { isValidElement, cloneElement } from 'react'
import { useState } from 'react'

function Form(props) {
  const [data, setData] = useState({})
  
  const inputs = props.children.map((child, i) => {
    if ( isValidElement(child) ) {
      return cloneElement(child, {onChange: inputChanged, key: i})
    }
  })

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
        debugger
      })
      .catch(console.error)
  }

  return (
    <form onSubmit={send} className="p-4">
      { inputs }
      <div className="flex justify-end p-4">
        <button className="p-4 py-2 text-xs text-white bg-purple-700 rounded-full">Save</button>
      </div>
    </form>
  )
}

export default Form