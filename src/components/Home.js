import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";
import Meal from './Meal'

function Home() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  let { path, url } = useRouteMatch();
  return (
    <>
      <ul className="">
        {days.map(day => 
          <li key={day}>
            {false ? 
              <Link to={`${url}/`} className="block p-4 px-8 cursor-pointer hover:bg-gray-100">{day}</Link>
              : 
              <span className="block p-4 px-8 cursor-pointer hover:bg-gray-100">{day}</span>
            }
          </li>
        )}
      </ul>
    </>
  )
}

export default Home