import { useContext } from 'react'
import { useHistory, useLocation } from "react-router-dom";
import AppContext from '../services/app-context'


function AppHeader() {
  const history = useHistory()
  const location = useLocation()
  const context = useContext(AppContext)
  
  function back(e) {
    e.preventDefault(); 
    if (history.length > 0 ) history.goBack()
  }

  return (
    <header className="z-20 flex items-center justify-center w-full">
      <i className="py-4 m-0 text-xs leading-none">&nbsp;</i>
      <div className="fixed top-0 left-0 z-10 w-full bg-gray-700">
        <div className="relative">
          {history.length > 0 && location.pathname !== '/' &&
            <a href="#" onClick={ back } className="absolute left-0 block px-4 py-4 pr-8 text-xs leading-none text-white">&larr;</a>
          }
          <h1 className="py-4 text-xs font-medium leading-none text-center text-white">
            { context.text }
          </h1>
        </div>
      </div>
    </header>
  )
}

export default AppHeader