import { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './Home'
import Meals from './Meals'
import Day from './Day'
import Login from './Login'
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col items-center w-screen h-screen pt-8">
        <header className="fixed top-0 left-0 flex w-full bg-white shadow-sm">
          <Link className="p-1 text-sm cursor-pointer hover:bg-red-300" to="/">Home</Link>
          <Link className="p-1 text-sm cursor-pointer hover:bg-red-300" to="/meals">Meals</Link>
          <Link className="p-1 text-sm cursor-pointer hover:bg-red-300" to="/login">Login</Link>
        </header>
        <div
          style={{minHeight: '400px'}}
          className="relative w-full bg-white rounded-lg shadow-lg md:w-1/2"
        >
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/meals">
              <Meals />
            </Route>
            <Route path="/days/:id">
              <Day />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default App;
