import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";

function Meal() {
  let { mealId } = useParams();
  return (
    <div>
      <Link to="/meals" className="block p-4">&larr; Meals</Link>
      <h1>{mealId}</h1>
    </div>
  )
}

export default Meal