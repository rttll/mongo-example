import { useState } from 'react'
import { Frame, Scroll, useCycle } from "framer"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './Home'
import Meals from './Meals'
import Login from './Login'
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col items-center w-screen h-screen p-4">
        <header className="flex py-4">
          <Link className="p-4 cursor-pointer hover:bg-red-300" to="/">Home</Link>
          <Link className="p-4 cursor-pointer hover:bg-red-300" to="/meals">Meals</Link>
          <Link className="p-4 cursor-pointer hover:bg-red-300" to="/login">Login</Link>
        </header>
        <div
          style={{height: '400px'}}
          className="w-full bg-white rounded-lg shadow-lg md:w-1/2"
        >
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/meals">
              <Meals />
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
