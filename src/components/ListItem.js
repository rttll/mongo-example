
function ListItem(props) {

  function doItemClick(e, item) {
    const action = props.onItemClick(e, item)
    if (typeof action === 'object' && typeof action.then === 'function') {
      action.then(cb => {
        if ( typeof cb === 'function') cb()
      })

    }
  }
  
  return (
    <div
      className="flex items-center justify-between h-full"
      onClick={ (e) => doItemClick(e, item) } 
    >
      <span className="flex-grow px-4 text-sm text-gray-700">{props.name}</span>
      
      {props.icon && props.icon}
    </div>    
  )
}

export default ListItem