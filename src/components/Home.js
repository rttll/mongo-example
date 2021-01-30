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
  const [days, setDays] = useState([])
  const [grid, setGrid] = useState([])
  const context = useContext(AppContext)
  let { path, url } = useRouteMatch();
  let thisMonthName = moment().format('MMMM')

  useEffect(() => {

    makeGrid()
    
    context.set()
    
    API.get('days')
    .then((resp) => { 
      setDays(resp.days.map(obj => {
        return {...obj, ...{date: moment(obj.date)}}
      }))
    })
    .catch(console.log)
  }, [])
  
  function makeGrid() {
    let gridDate = moment().startOf('year')
    let endOfYear = `${gridDate.format(`Y`)}-12-31`

    let gridDates = []
    while (gridDate.isSameOrBefore(endOfYear)) {
      // console.log(gridDate.format('MMM Do, Y'))
      gridDates.push({
        dayOfYear: gridDate.dayOfYear(), 
        date: gridDate.date(),
        timestamp: gridDate.valueOf()
      })
      gridDate.add(1, 'day')

    }
    setGrid(gridDates)
  }

  function clear() {
    API.delete('days', [])
      .then((resp) => {
        setDays([])
      })
  }
  
  return (
    <>
      <h1>{ thisMonthName }</h1>
      <div className="grid grid-cols-7">
        <div className="text-xs text-gray-300">mon</div>
        <div className="text-xs text-gray-300">tue</div>
        <div className="text-xs text-gray-300">wed</div>
        <div className="text-xs text-gray-300">thur</div>
        <div className="text-xs text-gray-300">fri</div>
        <div className="text-xs text-gray-300">sat</div>
        <div className="text-xs text-gray-300">sun</div>
        {grid.map(obj => 
          <div key={obj.dayOfYear} className="relative py-4 border-b border-r border-gray-200">
            { true &&
              <>
              <span className="absolute top-0 left-0 p-1 text-xs text-gray-500" style={{fontSize: '8px'}}>
                { obj.date } 
              </span>
              <div className="flex px-2 pt-2 space-x-1">
                <Link to={`/days/new/${obj.timestamp}`}>make</Link>
                {/* {days.filter(d => parseInt(d.date.format('D')) === int).length > 0 &&
                  <p>
                    hi
                    {[1, 2, 3].map(int => (
                      <i key={int} className="w-1 h-1 bg-green-300 rounded-full"></i>
                    ))}
                  </p>
                } */}
              </div>
              </>
            }

          </div>  
        )}
      </div>

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
              <Link to={`/days/show/${day._id}`} className="flex justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                <span className="text-sm">{day.date.format('dddd')}</span>
                <span className="text-sm text-gray-400">{day.date.format('M/D')}</span>
              </Link>
            </motion.li>
          )}
        </AnimatePresence>
      </ul>
      <div className="p-1">
        { days.length > 0 && <a href="#" onClick={ clear } className="inline-block p-4 my-8 text-lg text-red-600">X</a> }
      </div>
      
    </>
  )
}

export default Home