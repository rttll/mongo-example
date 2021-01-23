import React from "react";
import {
  Link,
  useParams,
  useHistory
} from "react-router-dom";

function Meal() {
  const history = useHistory()
  let { mealId } = useParams();
  return (
    <div>
      <span onClick={() => history.goBack()} className="block p-4 cursor-pointer">&larr; Back</span>
      <h1>{mealId}</h1>
    </div>
  )
}

export default Meal