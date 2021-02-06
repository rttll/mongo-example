
function Input(props) {  
  return (
    <input 
      type={props.type || 'text'}
      className="block w-full p-3 text-sm border border-gray-300 rounded"
      onChange={props.onChange} 
      name={props.name}
      defaultValue={props.value} />
  )
}

export { Input }
