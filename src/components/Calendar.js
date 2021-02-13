import React, { useState, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import moment from 'moment'
import { times } from 'lodash'
import API from '../services/api'
import AppContext from '../services/app-context'
import { list } from '../util/motion'
import CalendarDay from './CalendarDay'

import {
  Link,
  useHistory,
  useRouteMatch
} from "react-router-dom";

function Calendar() {
  const history = useHistory()
  const [days, setDays] = useState([])
  const [grid, setGrid] = useState([])
  const appHeader = useContext(AppContext)
  const dayNames = times(7, i => moment().startOf('week').add(i+1, 'days').format('ddd') )
  
  useEffect(() => {
    appHeader.setTitle() // Sets header text to default 
    makeGrid().then((grid) => {
      setGrid(grid)
    })
    // API.get('days')
    //   .then((resp) => { 
    //     // if ( resp.status === 401 ) history.push('/login')
    //     console.log(resp)
    //     setDays(
    //       resp.days.map(obj => { return {...obj, ...{date: moment(obj.date)}} })
    //     )
    //   })
    //   .catch((err) => {
    //     console.error(err)
    //   })
  }, [])
  
  useEffect(() => {
    if (grid.length > 0) {
      setTimeout(() => {
        const rect = document.getElementById('today').getBoundingClientRect()
        window.scrollTo(0, rect.top - 100)
      }, 0);
    }
  }, [grid])


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
              <CalendarDay 
                key={obj.id}  
                date={obj} 
                days={days}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Calendar