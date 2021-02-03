import React, { useState, useEffect } from "react";
import { Frame, Scroll } from 'framer'
import API from '../services/api'

function MealList(props) {
  const [meals, setMeals] = useState([])
  const [addingMeal, setAddingMeal] = useState(false)
  const [mealName, setMealName] = useState('')

  const scrollFrameHeight = () => {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden'
    return window.innerHeight - 100 - document.getElementById('app-header').clientHeight
  }

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
    <Scroll
      height={scrollFrameHeight()}
      id="items"
      backgroundColor="white"
      className="border-l border-r border-gray-300"
      width="100%"
    >
      {meals.map(meal => 
        <Frame height={50} width="100%" key={meal._id} backgroundColor="transparent" className="bg-white border-b border-gray-300">
          <span 
            onClick={ (e) => { props.onItemClick(e, meal._id) } } 
            className={`flex justify-between p-4 cursor-pointer bg-white hover:bg-gray-100 ${props.exclude.indexOf(meal._id) > -1 ? 'line-through text-gray-300' : ''} `}
          >
            <span>{meal.name}</span>
            {props.exclude.indexOf(meal._id) === -1 &&
              <span>+</span>
            }
          </span>
        </Frame>
      )}
      <Frame height={200} backgroundColor="transparent">
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
      </Frame>
      {/* <Frame height={100} backgroundColor="transparent"></Frame> */}

    </Scroll>

  )
}

export default MealList