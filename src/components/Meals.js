import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";
import API from '../services/api'
import Meal from './Meal'

function Meals() {
  const [meals, setMeals] = useState([])
  const { path, url } = useRouteMatch();

  useEffect(() => {
    API.get('meals')
      .then((resp) => {
        setMeals(resp.meals)
      })
      .catch((err) => {
          console.log(err)
      })
  }, []);


  return (
    <Switch>
      <Route exact path={path}>
        <h1>Meals</h1>
        <ul className="">
          {meals.map(meal => 
            <li key={meal._id}>
              <span className="block p-4 px-8 cursor-pointer hover:bg-gray-100">
                {meal.text}
              </span>
            </li>
          )}
        </ul>
      </Route>
      <Route path={`${path}/:mealId`}>
        <Meal />
      </Route>
    </Switch>
  )
}

export default Meals