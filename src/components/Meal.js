import React from "react";
import {
  useParams,
  useHistory
} from "react-router-dom";

function Meal() {
  const history = useHistory()
  let { mealId } = useParams();
  return (
    <div>
      <h1>{mealId}</h1>
    </div>
  )
}

export default Meal