import React, { useEffect, useState } from "react";
import moment from 'moment'
import API from '../services/api'
import {
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
  useHistory
} from "react-router-dom";
import MealList from './MealList'

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
  const history = useHistory();
  const { path, url } = useRouteMatch(); 
  const [day, setDay] = useState(null)
  const [meals, setMeals] = useState([])
  
  useEffect(() => {
    API.get('days?id=' + id)
      .then((resp) => {
        setDay({...resp.day, ...{date: moment(resp.day.date)}})
      })
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
    history.push(`/days/${id}`)
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
        <Route exact path={path}>
          {/* <Link to="/" className="block p-4">&larr; {day && day.date.format('dddd') }</Link> */}
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
          <Link to={`${url}/add`} className="block p-4">Add</Link>
        </Route>
        <Route path={`${path}/add`}>
          <div className="fixed top-0 left-0 w-full pt-12">
            <div className="h-screen pb-12 overflow-y-auto bg-white border border-gray-200 rounded-lg">
              {day && 
                <MealList exclude={day.meals} onItemClick={addMeal} />
              }
            </div>
          </div>
        </Route>
      </Switch>    
    </>
  )
}

export default Day