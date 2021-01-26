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
      .then((json) => {
        debugger
        setDay({...json, ...{date: moment(json.date)}})
        if ( json.meals.length > 0) setMeals(json.meals)
      })
  }, [])

  const addMeal = (mealId) => {
    history.push(`/days/${id}`)
    API.patch(`days/${id}`, {add_meal: mealId})
      .then((resp) => {
        setMeals(meals.concat([resp.meals.pop()]))
      })
  }

  return (
    <>
      <h1 className="p-4 text-xs font-medium bg-green-200">{day && day.date.format('dddd')}</h1>
      <Switch>
        <Route exact path={path}>
          {/* <Link to="/" className="block p-4">&larr; {day && day.date.format('dddd') }</Link> */}
          <ul>
            { meals.length > 0 &&
              meals.map(meal => 
                <li key={meal.id}>
                  <Link to={`/meals/${meal.id}`} className="block p-4 border-b border-gray-300 hover:bg-purple-200">
                    {meal.text}
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