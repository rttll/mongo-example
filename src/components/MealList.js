import React, { useState, useEffect } from "react";

function MealList(props) {
  const [meals, setMeals] = useState([])

  useEffect(() => {
    fetch(`/api/meals`)
      .then(resp => resp.json())
      .then((json) => {
        setMeals(json.meals)
      })
      .catch((err) => console.log)
  }, []);
  

  return (
    <ul className={props.className}>
      {meals.map(meal => 
        <li key={meal.id}>
          <span onClick={ () => { props.onItemClick(meal.id) } } className="block p-4 px-8 cursor-pointer hover:bg-gray-100">{meal.text}</span>
        </li>
      )}
    </ul>
  )
}

export default MealList