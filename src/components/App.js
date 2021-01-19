import { useState } from 'react'
import { Frame, Scroll, useCycle } from "framer"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './Home'
import Login from './Login'

import './App.css';


function App() {
  return (
    <Router>
      <div className="flex flex-col items-center w-screen h-screen">
        <header className="flex py-4">
          <Link className="p-4 cursor-pointer hover:bg-red-300" to="/">Home</Link>
          <Link className="p-4 cursor-pointer hover:bg-red-300" to="/login">Login</Link>
        </header>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;
