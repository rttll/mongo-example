import { useEffect, useState } from 'react';
import Sortable from "sortablejs";

function List(props) {
  const [sortable, setSortable] = useState(null)
  
  useEffect(() => {
    if ( sortable ) return;
    const container = document.querySelector('[data-list]')
    setSortable(
      Sortable.create(container, {
        dragClass: 'bg-gray-300',
        ghostClass: 'bg-green-100',
        handle: '.list-sort-handle',
        onEnd: function(e) {
          if ( e.newDraggableIndex !== e.oldDraggableIndex ) {
            const order = [].slice.call(e.from.children).map(el => parseInt(el.dataset.sortKey))
            props.onSortEnd(order)
          }
        }
      })
    );    
  }, [props.showActions])  

  function clicked(e, item) {
    const action = props.onItemClicked(e, item)
    if (typeof action === 'object' && typeof action.then === 'function') {
      action.then(cb => {
        if ( typeof cb === 'function') cb()
      })
    }
  }
  
  return (
    <div data-list>
      {props.items.map((item, i) => 
        <div
          width="100%"
          key={item.key || item._id}
          data-sort-key={item[props.sortKey]}
          className="w-full border-b border-gray-200"
        >
          <div className="flex items-stretch justify-between h-full">
            <span
              onClick={ (e) => clicked(e, item) } 
              className="flex flex-grow p-4 text-sm text-gray-700 items-left"
              >
              <span className="my-auto">{item.name}</span>
            </span>
            {props.showActions && 
              <div className="flex items-center h-full">
                <span
                  className="flex h-full px-6 py-4 text-sm text-gray-700 bg-yellow-400 cursor-move list-sort-handle"
                  >
                  <span className="m-auto">=</span>
                </span>
                <span
                  onClick={ (e) => props.deleteIconClicked && props.deleteIconClicked(e, item) } 
                  className="flex h-full px-6 py-4 text-sm text-gray-700 bg-red-400"
                >
                  <span className="m-auto">&times;</span>
                </span>

              </div>
            }
            
          </div>
        </div>
          
      )}
      
      {props.spacer && 
        <div style={{height: '200px'}} data-spacer></div>
      }

    </div>

  )
}

export default List