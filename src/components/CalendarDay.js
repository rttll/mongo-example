import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useRealmApp } from './RealmApp'
import moment from 'moment'

function CalendarDay(props) {
  const app = useRealmApp()
  const history = useHistory()
  const [data, setData] = useState(null)

  useEffect(() => {
    setData(props.data)
  }, [])
  
  function wasClicked() {
    if ( props.data._id ) {
      history.push('/days/' + props.data._id)
      return;
    }
    
    app.createDay(data.timestamp).then((resp) => {
      history.push('/days/' + resp.day._id)
    })

  }


  return (
    <>
      {data && 
        <div
          onClick={wasClicked} 
          id={ data.isToday ? 'today' : ''}
          className={`${data.isToday ? 'bg-yellow-100' : ''} ${data.filler ? 'opacity-0' : 'bg-white'} flex-col items-center relative flex justify-center border-b border-r border-gray-200 hover:bg-blue-50`}
        >
          <p className="font-medium text-gray-700">
            {data.dayOfMonth}
            <span className="block">{data.mealIds && data.mealIds.lengh}</span>
          </p>
          <div className="flex p-1 space-x-1 overflow-hidden whitespace-nowrap">
            {data.mealIds && data.mealIds.map(int => 
              <i key={int} className="w-1 h-1 bg-yellow-500 rounded-full"></i>
            )}
          </div>
        </div>    
      }
    </>
  )
}

export default CalendarDay