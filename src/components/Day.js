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

function Day() {
  let { id } = useParams();
  const history = useHistory();
  const { path, url } = useRouteMatch(); 
  const [day, setDay] = useState(null)
  const [meals, setMeals] = useState([])
  
  useEffect(() => {
    console.log('fetching day')
    API.get('days?id=' + id)
      .then((resp) => {
        setDay({...resp.day, ...{date: moment(resp.day.date)}})
        // if ( json.meals.length > 0) setMeals(json.meals)
      })
  }, [])

  const addMeal = (mealId) => {
    // history.push(`/days/${id}`)
    API.patch('days', { id: id, day: {meals: day.meals.concat([mealId])} } )
      .then((resp) => {
        console.log('added meal', resp)
        // debugger
        // setMeals(meals.concat([resp.meals.pop()]))
      })
  }

  return (
    <>
      <h1 style={{fontSize: '8px'}} className="p-1 font-medium text-center text-white bg-gray-700">{day && day.date.format('dddd')}</h1>
      <Switch>
        <Route exact path={path}>
          {/* <Link to="/" className="block p-4">&larr; {day && day.date.format('dddd') }</Link> */}
          <ul>
            { day && day.foo.length > 0 &&
              day.foo.map(meal => 
                <li key={meal._id}>
                  <Link to={`/meals/${meal._id}`} className="block p-4 border-b border-gray-300 hover:bg-purple-200">
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
            <div className="h-screen bg-white border border-gray-200 rounded-lg">
              <MealList onItemClick={addMeal} />
            </div>
          </div>
        </Route>
      </Switch>    
    </>
  )
}

export default Day