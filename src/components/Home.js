import React, { useState, useEffect } from "react";
import moment from 'moment'
import API from '../services/api'
import {
  Link,
  useRouteMatch
} from "react-router-dom";

function Home() {
  window.moment = moment
  const [addingDay, setaddingDay] = useState(false)
  const [days, setDays] = useState([])
  
  let { path, url } = useRouteMatch();
  
  useEffect(() => {
    API.get('days')
      .then((resp) => { 
        setDays(resp.days.map(obj => {
          return {...obj, ...{date: moment(obj.date)}}
        }))
      })
  }, [])

  function clear() {
    API.delete('days', [])
      .then((resp) => {
        setDays([])
      })
  }

  function addDay() {
    if ( addingDay ) return;
    setaddingDay(true)
    
    let date = days.length > 0 ? 
      moment(days[days.length - 1].date).add(1, 'day').format('yyyy-MM-D') :
      moment().format('yyyy-MM-D')
    
    API.post('days', {date: date})
      .then(day => {
        day.date = moment(day.date)
        setDays(days.concat([day]))
        setaddingDay(false)
      })
      .catch(console.log)
  }
  
  return (
    <>
      <ul className="">
        {days.map(day => 
          <li key={day._id}>
            { day._id }
            <Link to={`/days/${day._id}`} className="flex justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
              <span className="text-sm">{day.date.format('dddd')}</span>
              <span className="text-sm text-gray-400">{day.date.format('M/D')}</span>
            </Link>
          </li>
        )}
      </ul>
      <a href="#" onClick={ addDay } className="block p-4 my-8 text-lg text-center text-blue-400 bg-blue-100">+</a>
      { days.length > 0 && <a href="#" onClick={ clear } className="inline-block p-4 my-8 text-lg text-red-600">X</a> }
    </>
  )
}

export default Home