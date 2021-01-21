import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";
import Meal from './Meal'

function Meals() {
  const [meals, setMeals] = useState([])
  const { path, url } = useRouteMatch();

  useEffect(() => {
    fetch('/api/meals')
      .then(resp => resp.json())
      .then((json) => {
        setMeals(json.meals)
      })
      .catch((err) => console.log)
  }, []);


  return (
    <Switch>
      <Route exact path={path}>
        <h1>Meals</h1>
        <ul className="">
          {meals.map(meal => 
            <li key={meal.id}>
              <span className="block p-4 px-8 cursor-pointer hover:bg-gray-100">{meal.text}</span>
            </li>
          )}
          {/* <li className="">
            <Link to={`${url}/a`} className="block p-4 px-8 cursor-pointer hover:bg-gray-100">Chicken & rice</Link>
          </li>
          <li className="">
            <Link to={`${url}/b`} className="block p-4 px-8 cursor-pointer hover:bg-gray-100">Minestrone</Link>
          </li>
          <li className="">
            <Link to={`${url}/c`} className="block p-4 px-8 cursor-pointer hover:bg-gray-100">Vegetable</Link>
          </li> */}
        </ul>
      </Route>
      <Route path={`${path}/:mealId`}>
        <Meal />
      </Route>
    </Switch>
  )
}

export default Meals