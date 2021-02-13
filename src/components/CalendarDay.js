import { Link } from 'react-router-dom'

function CalendarDay(props) {
  return (
    <Link 
      to={props.date.href || '/'}
      id={ props.date.isToday ? 'today' : ''}
      className={`${props.date.isToday ? 'bg-yellow-100' : ''} ${props.date.filler ? 'opacity-0' : 'bg-white'} flex-col items-center relative flex justify-center border-b border-r border-gray-200 hover:bg-blue-50`}
    >
      <p className="font-medium text-gray-700">
        {props.date.date}
      </p>
      <div className="flex p-1 space-x-1 overflow-hidden whitespace-nowrap">
        {props.date.mealIds && props.date.mealIds.map(int => 
          <i key={int} className="w-1 h-1 bg-yellow-500 rounded-full"></i>
        )}
      </div>
    </Link>    
  )
}

export default CalendarDay