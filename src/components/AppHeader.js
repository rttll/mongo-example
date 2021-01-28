import { useContext } from 'react'
import AppContext from '../services/app-context'

function AppHeader() {
  const context = useContext(AppContext)
  return (
    <header className="flex items-center justify-center w-full">
      <i className="py-2 m-0 text-xs leading-none">&nbsp;</i>
      <h1 className="fixed top-0 left-0 z-10 w-full py-2 text-xs font-medium leading-none text-center text-white bg-gray-700 " >
        { context.text }
      </h1>
    </header>
  )
}

export default AppHeader