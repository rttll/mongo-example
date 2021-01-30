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
  useHistory
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
  let { action, slug } = useParams();
  const history = useHistory()
  const { path, url } = useRouteMatch(); 
  const [day, setDay] = useState(null)
  const [meals, setMeals] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const context = useContext(AppContext)

  const bgName = (index) => {
    let max = bgClasses.length - 1
    if (index > max) index = max
    let klass = bgClasses[index]
    return klass
  }

  useEffect(() => {
    context.set('Loading...')
    if ( action === 'show' ) {
      fetchDay()
    } else {
      createDay()
    }
   
  }, [])  

  function createDay() {
    let date = moment(parseInt(slug))
    API.post('days', {date: date.format('yyyy-MM-D')})
    .then(resp => {
        setDay({...resp.day, ...{date: date}})
        context.set(date.format('dddd'))
        history.replace(`/days/show/${resp.day._id}`)
      })
      .catch(console.log)
  }

  function fetchDay() {
    API.get('days?id=' + slug)
    .then((resp) => {
      let date = moment(resp.day.date)
      setDay({...resp.day, ...{date: date}})
      context.set(date.format('dddd'))
    })
    .catch(console.error)
  }

  function toggleMeal(mealId) {
    setIsAdding(false)
    const meals = day.meals.indexOf(mealId) === -1 ? day.meals.concat([mealId]) : day.meals.filter(id => id !== mealId)
    API.patch('days', { id: slug, day: {meals: meals } } )
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

  return (
    <>
      <Switch>
        <Route path={path}>
          <ul>
            { day && day.foo.length > 0 &&
              day.foo.map((meal, index) => 
                <li key={meal._id} className={`${bgName(index)} flex items-stretch`}>
                  <Link to={`/meals/${meal._id}`} className={`block p-4 flex-grow`}>
                    {meal.name}
                  </Link>
                  <a href="#" onClick={ () => toggleMeal(meal._id) } className="flex items-center px-4 ">
                    <span>X</span>
                  </a>
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
                onItemClick={ toggleMeal }
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