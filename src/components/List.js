import { Frame, Scroll } from 'framer'
import { useState } from 'react';
import Sortable from "sortablejs";

function List(props) {
  const [sortable, setSortable] = useState(null)
  
  function doItemClick(e, item) {
    const action = props.onItemClick(e, item)
    if (typeof action === 'object' && typeof action.then === 'function') {
      action.then(cb => {
        if ( typeof cb === 'function') cb()
      })

    }
  }

  function initSort() {
    if ( sortable ) return;
    const container = document.getElementById('meal-list')
    setSortable(
      Sortable.create(container, {
        dragClass: 'bg-gray-300',
        ghostClass: 'bg-green-100',
        onEnd: function(e) {
          if ( e.newDraggableIndex !== e.oldDraggableIndex ) {
            let order = [].slice.call(e.from.children).map(el => parseInt(el.dataset.id))
            update({mealOrder: order})
          }
        }
      })
    );
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
          key={item.key || item._id}
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
      
      {/* <Frame height={200} data-spacer backgroundColor="transparent"></Frame> */}

    </Scroll>

  )
}

export default List