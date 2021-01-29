import React, { useEffect, useState, useContext } from "react";
import moment from 'moment'
import API from '../services/api'
import AppContext from '../services/app-context'

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
  const context = useContext(AppContext)

  useEffect(() => {
    context.set('Loading...')
    API.get('days?id=' + id)
      .then((resp) => {
        let date = moment(resp.day.date)
        setDay({...resp.day, ...{date: date}})
        context.set(date.format('dddd'))
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
          if (resp.day) {
            setDay({...resp.day, ...{date: moment(resp.day.date)}})
          } else {
            console.error('then err', resp)
          }
        }).catch((err) => {
          console.error('catch err', err)
        }).finally(() => {
          console.log('patch request done')
        })
    }
  }

  return (
    <>
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
              exit="hidden"
              variants={slideUp}
              custom={document.documentElement.clientHeight - 40}
              onClick={ (e) => { e.currentTarget === e.target ? setIsAdding(false) : '' }}
              className="absolute top-0 z-20 flex flex-col w-full h-screen pt-20 overflow-hidden"
            >
              <MealList 
                exclude={day.meals} 
                onItemClick={addMeal}
                className="flex flex-col h-full overflow-y-auto bg-white border border-gray-200 rounded-t-xl"
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