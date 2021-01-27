import React, { useState, useEffect } from "react";
import API from '../services/api'

function MealList(props) {
  const [meals, setMeals] = useState([])

  useEffect(() => {
    API.get('meals')
      .then((resp) => {
        console.log(resp)
        setMeals(resp.meals)
      })
      .catch((err) => console.log)
  }, []);
  

  return (
    <ul className={props.className}>
      {meals.map(meal => 
        <li key={meal._id}>
          <span onClick={ () => { props.onItemClick(meal._id) } } className="block p-4 px-8 cursor-pointer hover:bg-gray-100">{meal.name}</span>
        </li>
      )}
    </ul>
  )
}

export default MealList