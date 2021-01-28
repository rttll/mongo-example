import React, { useEffect, useState } from "react";
import moment from 'moment'
import API from '../services/api'
import {
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import MealList from './MealList'
import { AnimatePresence, motion } from "framer-motion";
import { slideUp } from '../util/motion'

// Classnames need to be stored explicity, or PurgeCSS will not include them.
const bgClasses = [
  'bg-green-100',
  'bg-green-200',
  'bg-green-300',
  'bg-green-400',
  'bg-green-500',
  // 'bg-green-600',
  // 'bg-green-700',
]

function Day() {
  let { id } = useParams();
  const { path, url } = useRouteMatch(); 
  const [day, setDay] = useState(null)
  const [meals, setMeals] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  
  useEffect(() => {
    API.get('days?id=' + id)
      .then((resp) => {
        setDay({...resp.day, ...{date: moment(resp.day.date)}})
      })
      .catch(console.error)
  }, [])  
  
  const bgName = (index) => {
    let max = bgClasses.length - 1
    if (index > max) index = max
    let klass = bgClasses[index]
    // if ( klass === undefined ) {
    //   let dif = Math.abs(max - index)
    //   let newIndex = max - dif
    //   if ( newIndex < 0) {
    //     newIndex = Math.max(max, Math.abs(newIndex))
    //   }
    //   klass = bgClasses[newIndex]
    // }
    return klass
  }

  function addMeal(mealId) {
    setIsAdding(false)
    if ( day.meals.indexOf(mealId) < 0) {
      API.patch('days', { id: id, day: {meals: day.meals.concat([mealId])} } )
      .then((resp) => {
        setDay({...resp.day, ...{date: moment(resp.day.date)}})
      })
    }
  }

  return (
    <>
      <h1 style={{fontSize: '8px'}} className="p-1 font-medium text-center text-white bg-gray-700">{day && day.date.format('dddd')}</h1>
      <Switch>
        <Route path={path}>
          <ul>
            { day && day.foo.length > 0 &&
              day.foo.map((meal, index) => 
                <li key={meal._id}>
                  <Link to={`/meals/${meal._id}`} className={`${bgName(index)} block p-4`}>
                    {meal.name}
                  </Link>
                </li>
              )
            }
          </ul>
          <a href="" className="block p-4" onClick={(e) => {e.preventDefault(); setIsAdding(true)} }>Add</a>
          
          <AnimatePresence>
            {day && isAdding && 
              <motion.div
                key="card"
                animate="visible"
                initial="hidden"
                variants={slideUp}
                exit="hidden"
                onClick={ (e) => { e.currentTarget === e.target ? setIsAdding(false) : '' }}
                className="absolute top-0 z-20 flex flex-col w-full h-screen pt-20 overflow-hidden"
              >
                <MealList 
                  exclude={day.meals} 
                  onItemClick={addMeal}
                  // style={{minHeight: `calc(100%)`}} 
                  className="flex flex-col h-full overflow-y-auto bg-white border border-gray-200 rounded-tl-lg rounded-tr-lg"
                />
              </motion.div>
              }
          </AnimatePresence>

          { isAdding && 
            <motion.div 
              initial={{opacity: 0}}
              animate={{opacity: .5}}
              className="fixed inset-0 z-10 w-full h-screen bg-gray-700"
              onClick={(e) => {e.currentTarget === e.target ? setIsAdding(false) : ''} }
            />
          }
          
        </Route>
        
      </Switch>    
    </>
  )
}

export default Day