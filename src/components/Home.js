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
  const dayNames = times(7, i => moment().startOf('week').add(i+1, 'days').format('ddd') )
  
  useEffect(() => {
    context.set() // Sets header text to default 
    API.get('days')
      .then((resp) => { 
        let formatted = resp.days.map(obj => {
          return {...obj, ...{date: moment(obj.date)}}
        })
        mergeDaysAndGrid(formatted)
      })
      .catch(console.log)
  }, [])
  
  useEffect(() => {
    if (grid.length > 0) {
      setTimeout(() => {
        const rect = document.getElementById('today').getBoundingClientRect()
        window.scrollTo(0, rect.top - 100)
      }, 0);
    }
  }, [grid])

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
          date: gridDate.date(),
          // date: gridDate.format('ddd, MMM') + ' ' + gridDate.date(),
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
        <div key={month.name} className="flex flex-col" style={{height: window.innerHeight - document.getElementById('app-header').clientHeight}}>
          <header className="sticky z-10 pt-1 pb-2 bg-white" style={{top: '40px'}}>
            <h1 className="px-1 py-1 text-gray-700 uppercase bg-white">{month.name}</h1>
            <div className="grid flex-grow grid-cols-7">
              {dayNames.map((name) => 
                <div key={name} className="flex-shrink pl-1 text-xs text-gray-500">{name}</div>
              )}
            </div>
          </header>
          <div className="grid flex-1 grid-cols-7 bg-gray-100">
            {month.dates.map((obj) =>
              <Link 
                to={obj.href}
                key={obj.id} 
                id={ obj.isToday ? 'today' : ''}
                className={`${obj.isToday ? 'bg-yellow-100' : ''} ${obj.filler ? 'opacity-0' : 'bg-white'} flex-col items-center relative flex justify-center border-b border-r border-gray-200 hover:bg-blue-50`}
              >
                <p className="font-medium text-gray-700">
                  {obj.date}
                </p>
                <div className="flex p-1 space-x-1 overflow-hidden whitespace-nowrap">
                  {obj.mealIds.map(int => 
                    <i key={int} className="w-1 h-1 bg-yellow-500 rounded-full"></i>
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