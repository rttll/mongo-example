import React, { useState, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import moment from 'moment'
import API from '../services/api'
import AppContext from '../services/app-context'
import { list } from '../util/motion'

import {
  Link,
  useRouteMatch
} from "react-router-dom";

function Home() {
  window.moment = moment
  const [addingDay, setaddingDay] = useState(false)
  const [days, setDays] = useState([])
  const context = useContext(AppContext)
  let { path, url } = useRouteMatch();
  
  useEffect(() => {
    context.set()
    API.get('days')
      .then((resp) => { 
        setDays(resp.days.map(obj => {
          return {...obj, ...{date: moment(obj.date)}}
        }))
      })
      .catch(console.log)
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
        <AnimatePresence>
          {days.map((day, i) => 
            <motion.li
              key={day._id}
              animate="visible"
              initial="hidden"
              variants={list}
              custom={i}
            >
              <Link to={`/days/${day._id}`} className="flex justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                <span className="text-sm">{day.date.format('dddd')}</span>
                <span className="text-sm text-gray-400">{day.date.format('M/D')}</span>
              </Link>
            </motion.li>
          )}
        </AnimatePresence>
      </ul>
      <a href="#" onClick={ addDay } className="block p-4 my-8 text-lg text-center text-blue-400 bg-blue-100">+</a>
      <div className="p-1">
        { days.length > 0 && <a href="#" onClick={ clear } className="inline-block p-4 my-8 text-lg text-red-600">X</a> }
      </div>
    </>
  )
}

export default Home