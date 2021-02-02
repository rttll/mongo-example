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
      <Frame
        width="100%"
        // height="100%"
        className={props.className}
        backgroundColor="blue"
      >
        <Scroll
          height={scrollFrameHeight()}
          id="items"
          backgroundColor="#fff"
          className="border-l border-r border-gray-300"
          width="100%"
        >
          {meals.map(meal => 
            <Frame height={50} width="100%" key={meal._id} backgroundColor="#fff" className="bg-white border-b border-gray-300">
              <span 
                onClick={ (e) => { props.onItemClick(e, meal._id) } } 
                className={`flex justify-between p-4 cursor-pointer hover:bg-gray-100 ${props.exclude.indexOf(meal._id) > -1 ? 'line-through text-gray-300' : ''} `}
              >
                <span>{meal.name}</span>
                {props.exclude.indexOf(meal._id) === -1 &&
                  <span>+</span>
                }
              </span>
            </Frame>
          )}
          <Frame height={100}  backgroundColor="#fff"></Frame>

        </Scroll>
      </Frame>
  )
}

export default MealList