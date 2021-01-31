import React, { useState, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import moment from 'moment'
import { times } from 'lodash'
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
    context.set() // Sets header text to default 
    API.get('days')
      .then((resp) => { 
        let formatted = resp.days.map(obj => {
          return {...obj, ...{date: moment(obj.date)}}
        })
        // setDays(formatted)
        mergeDaysAndGrid(formatted)
      })
      .catch(console.log)
  }, [])
  
  function mergeDaysAndGrid(days) {
    makeGrid().then((grid) => {
      let merged = grid.map((month) => {
        let formatted = month.dates.map((gridObj) => {
          let filteredDays = days.filter(obj => obj.date.valueOf() === gridObj.timestamp)
          let href = `/days/new/${gridObj.timestamp}`
          let mealIds = []
          if ( filteredDays.length > 0 ) {
            let day = filteredDays[0]
            mealIds = day.mealIds
            href = `/days/show/${day._id}`
          }
          return {...gridObj, ...{href: href, mealIds: mealIds} }
        })
        return {...month, ...{dates: formatted} }
      })
      setGrid(merged)
    })
  }

  function makeGrid() {
    return new Promise(function(resolve, reject) {
      let gridDate = moment().startOf('year')
      let endOfYear = moment().endOf('year')
  
      let gridDates = []
      let curMonth = { dates: [] };
      
      while (gridDate.isSameOrBefore(endOfYear)) {
        if ( gridDate.date() === 1) {
          curMonth = {
            name: gridDate.format('MMMM'),
            dates: [],
          } 

          let offset = 0;
          if ( gridDate.day() > 1 ) offset = gridDate.day() -1
          if (gridDate.day() < 1) offset = 6

          if (offset > 0) {
            times(offset, (i) => {
              curMonth.dates.push({
                id: Math.random(),
                filler: true
              })
            })
          }
        }
        curMonth.dates.push({
          id: gridDate.dayOfYear(), 
          date: gridDate.format('ddd, MMM') + ' ' + gridDate.date(),
          timestamp: gridDate.valueOf(),
          isToday: gridDate.dayOfYear() === moment().dayOfYear()
        })
        
        gridDate.add(1, 'day')
        
        if ( gridDate.date() === gridDate.daysInMonth() ) {
          gridDates.push(curMonth)
        }
      }
      resolve(gridDates)
    })
  }

  function clear() {
    API.delete('days', [])
      .then((resp) => {
        setDays([])
      })
  }
  
  return (
    <>
      {grid.map((month, i) =>
        <div key={month.name}>
          <h1 className="px-1 py-4 text-xs text-gray-600">{month.name}</h1>
          <div className="grid grid-cols-7">
            <div className="text-xs text-gray-300">mon</div>
            <div className="text-xs text-gray-300">tue</div>
            <div className="text-xs text-gray-300">wed</div>
            <div className="text-xs text-gray-300">thur</div>
            <div className="text-xs text-gray-300">fri</div>
            <div className="text-xs text-gray-300">sat</div>
            <div className="text-xs text-gray-300">sun</div>
            
            {month.dates.map((obj) =>
              <Link 
                to={obj.href}
                key={obj.id} 
                className={`${obj.isToday ? 'bg-yellow-100' : ''} relative py-4 border-b border-r border-gray-200 hover:bg-blue-50`}
              >
                <span className="absolute top-0 left-0 p-1 text-xs text-gray-500" style={{fontSize: '8px'}}>
                  { obj.date } 
                </span>
                <div className="flex p-1 space-x-1">
                  {obj.mealIds.map(int => 
                    <i key={int} className="w-1 h-1 bg-green-200 rounded-full"></i>
                  )}
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
      <div className="p-1">
        { days.length > 0 && <a href="#" onClick={ clear } className="inline-block p-4 my-8 text-lg text-red-600">X</a> }
      </div>
    </>
  )
}

export default Home