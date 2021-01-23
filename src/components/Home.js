import React, { useState, useEffect } from "react";
import moment from 'moment'
import API from '../services/api'
import {
  Link,
  useRouteMatch
} from "react-router-dom";
import MealsList from './MealList'

function Home() {
  window.moment = moment
  const [days, setDays] = useState([])
  const [meals, setMeals] = useState([])
  const [showMeals, setShowMeals] = useState(false)
  const [activeDay, setActiveDay] = useState(null)
  
  let { path, url } = useRouteMatch();
  
  useEffect(() => {
    const today = moment().local()

    let dates = [0, 1, 2, 3, 4, 5, 6]
      .map(int => moment().add(int, 'days'))

    API.post('days/batch', {dates: dates})
      .then((json) => { 
        setDays(json.map(obj => {
          return {...obj, ...{date: moment(obj.date)}}
        }))
      })
  }, [])

  function openMealsFor(day) {
    setActiveDay(day)
    setShowMeals(true)
  }
  
  function setMeal(id) {
    setShowMeals(false)
  }
  
  return (
    <>
      <ul className="">
        {days.map(day => 
          <li key={day.id}>
            <Link to={`/days/${day.id}`} className="block p-4 px-8 cursor-pointer hover:bg-gray-100">
              {day.date.format('dddd')}
            </Link>
          </li>
        )}
      </ul>
      {showMeals && 
        <MealsList 
          onItemClick={ setMeal }
          className={"absolute bg-white shadow-lg w-full top-0"}
         /> 
      }
    </>
  )
}

export default Home