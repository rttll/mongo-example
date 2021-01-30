import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import API from '../services/api'
import AppContext from '../services/app-context'


function Meal() {
  let { id } = useParams();
  const [confirmation, setConfirmation] = useState(0)
  const [meal, setMeal] = useState()
  const history = useHistory()
  const context = useContext(AppContext)

  useEffect(() => {
    context.set('Loading...')
    API.get('meals?id=' + id)
      .then((resp) => {
        if (resp.meal) {
          setMeal(resp.meal)
          context.set(resp.meal.name)
        } else {

        }
      })
      .catch(console.error)
  }, [])  

  function destroy(e) {
    e.preventDefault();
    if (confirmation === 0) {
      setConfirmation(confirmation + 1)
      return
    }

    API.delete('meals', {id: id})
      .then((resp) => {
        if (resp.deleted === 1) {
          history.goBack()
        } else {
          console.error(resp)
        }
      })
      .catch(console.error)
    
  }

  return (
    <div>
      {meal && 
        <>
          <h1 className="p-4">{ meal.name }</h1>
          <div className="flex flex-row">
            <a href="#" onClick={ destroy } className="inline-block p-4 text-xs text-red-500">
              {confirmation === 0 ? 'Delete' : 'Delete Now'}
            </a>
            {confirmation > 0 &&
              <a href="#" onClick={ () => { setConfirmation(0) } } className="block p-4 ml-4 text-xs text-blue-500">
                Cancel
              </a>
            }
          </div>
        </>
      }
    </div>
  )
}

export default Meal