import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import AppHeader from './AppHeader'
import Calendar from './Calendar'
import Meals from './Meals'
import Day from './Day'
import Login from './Login'
import NewUser from './NewUser'
import Account from './Account'
import AppContext from '../services/app-context'
import { RealmAppProvider } from "./RealmApp";
import './App.css';

if ( process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

function App() {

  const defaultText = 'Meal Planner'
  const [headerText, setHeaderText] = useState(defaultText)
  const [user, setUser] = useState(null)
  
  const defaultHeader = {
    text: headerText,
    setTitle: (text = defaultText) => {
      setHeaderText(text)
    },
    user: user,
    setUser: (user) => {
      localStorage.setItem('meal-planner-user', JSON.stringify(user))
      setUser(user)
    }
  }

  useEffect(() => {
    let user = localStorage.getItem('meal-planner-user')
    if (user === null) return;
    setUser(JSON.parse(user))
  }, [])

  return (
    <RealmAppProvider appId={ 'mealplanner-pqmhu' }>
      <AppContext.Provider value={defaultHeader}>
        <Router>
          <div className="flex flex-col items-center w-screen bg-white">
            <AppHeader />
            <div className="relative w-full h-full">
              <Switch>
                <Route exact path="/">
                  <Calendar />
                </Route>
                <Route path="/meals">
                  <Meals />
                </Route>
                <Route path="/days/:id">
                  <Day />
                </Route>
                <Route path="/users">
                  <NewUser />
                </Route>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/account">
                  <Account />
                </Route>
              </Switch>
            </div>
          </div>
        </Router>
      </AppContext.Provider>
    </RealmAppProvider>
  )
}

export default App;
