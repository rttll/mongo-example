import React, { useState, useEffect } from "react";
import {
  Link,
  useRouteMatch
} from "react-router-dom";
import MealsList from './MealList'

function Home() {
  const [weeks, setWeeks] = useState([])
  const [days, setDays] = useState([])
  const [meals, setMeals] = useState([])
  const [showMeals, setShowMeals] = useState(false)
  const [activeDay, setActiveDay] = useState(null)
  let { path, url } = useRouteMatch();
  
  // const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  useEffect(() => {
    fetch('/api/weeks')
      .then((resp) => resp.json())
      .then((json) => {
        setWeeks(json)
        setDays(json[0].days)
        console.log(json[0].days)
      })
      .catch(err => console.log)
  }, [])
  
  // useEffect(() => {
  //   fetch(`/api/weeks/${}`)
  //     .then((resp) => resp.json())
  //     .then((json) => {
  //       setWeeks(json)
  //       setDays(json[0].days)
  //       console.log(json[0].days)
  //     })
  //     .catch(err => console.log)
  // }, [])

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
            {false ? 
              <Link to={`${url}/`} className="block p-4 px-8 cursor-pointer hover:bg-gray-100">{day.text}</Link>
              : 
              <span onClick={() => openMealsFor(day)} className="block p-4 px-8 cursor-pointer hover:bg-gray-100">{day.text}</span>
            }
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