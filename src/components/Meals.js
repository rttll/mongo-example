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
        // console.log(resp)
        setMeals(resp.meals)
      })
      .catch((err) => {
          console.log(err)
      })
  }, []);


  return (
    <Switch>
      <Route exact path={path}>
        <h1 className="p-4">Meals</h1>
        <ul className="">
          {meals.map(meal => 
            <li key={meal._id}>
              <span className="block p-4 cursor-pointer hover:bg-gray-100">
                {meal.name}
              </span>
            </li>
          )}
        </ul>
      </Route>
      <Route path={`${path}/:id`}>
        <Meal />
      </Route>
    </Switch>
  )
}

export default Meals