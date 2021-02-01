import React, { useState, useEffect } from "react";
import API from '../services/api'

function MealList(props) {
  const [meals, setMeals] = useState([])
  const [addingMeal, setAddingMeal] = useState(false)
  const [mealName, setMealName] = useState('')

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
        setMealName('')
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setAddingMeal(false)
      })
  }

  return (
    <div className={`${props.className} flex flex-col`} style={props.style}>
      <header className="flex items-center justify-between bg-gray-100 border-b border-gray-200">
        <h1 className="p-4 text-sm font-medium leading-none">Meals</h1>
        {props.closeSelf && 
          <a href="#" onClick={ props.closeSelf } className="inline-block p-4 text-sm">&times;</a>
        }
      </header>
      <div className="flex-grow pb-20 overflow-y-auto">
        <ul>
          {meals.map(meal => 
            <li key={meal._id} className="bg-white border-b border-gray-300">
              <span 
                onClick={ (e) => { props.onItemClick(e, meal._id) } } 
                className={`flex justify-between p-4 cursor-pointer hover:bg-gray-100 ${props.exclude.indexOf(meal._id) > -1 ? 'line-through text-gray-300' : ''} `}
              >
                <span>{meal.name}</span>
                {props.exclude.indexOf(meal._id) === -1 &&
                  <span>+</span>
                }
              </span>
            </li>
          )}
        </ul>
        <form action="/meals" onSubmit={createMeal}>
          <div className="flex justify-between border-b border-gray-300">
            <input 
              type="text" 
              className="block w-full p-4"
              value={mealName}
              onChange={ (e) => setMealName(e.target.value) }
              placeholder="Create new meal"
            />
            <button type="submit" className="p-4">+</button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default MealList