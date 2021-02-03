import { Frame, Scroll } from 'framer'

function List(props) {

  function doItemClick(e, item) {
    props.onItemClick(e, item).then(cb => {
      if ( typeof cb === 'function') cb()
    })
  }

  return (
    <Scroll
      data-list
      backgroundColor="white"
      height={'100%'}
      width="100%"
    >
      {props.items.map((item, i) => 
        <Frame
          height={50}
          width="100%"
          key={item.key}
          backgroundColor="transparent"
          className="border-b border-gray-300"
        >
          <span 
            onClick={ (e) => doItemClick(e, item) } 
            className={`flex justify-between p-4 cursor-pointer bg-white hover:bg-gray-100 ${item.inactive ? 'line-through text-gray-300' : ''} `}
          >
            {item.name}
          </span>
        </Frame>
      )}
      
      <Frame height={200} data-spacer backgroundColor="transparent"></Frame>

    </Scroll>

  )
}

export default List