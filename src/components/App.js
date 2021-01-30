import { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import AppHeader from './AppHeader'
import Home from './Home'
import Meals from './Meals'
import Day from './Day'
import Login from './Login'
import AppContext from '../services/app-context'
import './App.css';

function App() {
  const defaultText = 'Meal Planner'
  const [headerText, setHeaderText] = useState(defaultText)
  
  const defaultHeader = {
    text: headerText,
    set: (text = defaultText) => {
      setHeaderText(text)
    }
  }

  return (
    <AppContext.Provider value={defaultHeader}>
      <Router>
        <div className="flex flex-col items-center w-screen min-h-screen bg-white">
          <AppHeader />
          <div
            style={{minHeight: '400px'}}
            className="relative w-full md:w-1/2"
          >
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/meals">
                <Meals />
              </Route>
              <Route path="/days/:action/:slug">
                <Day />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </AppContext.Provider>
  )
}

export default App;
