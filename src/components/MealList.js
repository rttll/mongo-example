import React, { useState, useEffect } from "react";
import API from '../services/api'

function MealList(props) {
  const [meals, setMeals] = useState([])
  const [addingMeal, setAddingMeal] = useState(false)
  const [showMealForm, setShowMealForm] = useState(false)
  const [mealName, setMealName] = useState(null)

  useEffect(() => {
    API.get('meals')
      .then((resp) => {
        setMeals(resp.meals)
      })
      .catch((err) => console.log)
  }, []);
  
  function createMeal(e) {
    e.preventDefault();

    if ( addingMeal ) return;
    setAddingMeal(true)
    
    API.post('meals', {name: mealName})
      .then(meal => {
        setMeals(meals.concat([meal]))
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setAddingMeal(false)
        setShowMealForm(false)
      })
  }

  return (
    <>
      <ul className={props.className}>
        {meals.map(meal => 
          <li key={meal._id}>
            <span onClick={ () => { props.onItemClick(meal._id) } } className={`${props.exclude.indexOf(meal._id) > -1 ? 'line-through text-gray-300' : ''} block p-4 px-8 cursor-pointer hover:bg-gray-100`}>{meal.name}</span>
          </li>
        )}
      </ul>
      {showMealForm &&
        <form action="/meals" onSubmit={createMeal}>
          <div className="p-4">
            <input 
              type="text" 
              onChange={ (e) => setMealName(e.target.value) }
              placeholder="Add new meal"
            />
          </div>
        </form>
      }
      <a href="#" onClick={ () => { setShowMealForm(!showMealForm) } } className="block p-4 my-8 text-lg text-center text-blue-400 bg-blue-100">+</a>
    </>
  )
}

export default MealList