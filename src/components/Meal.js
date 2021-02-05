import React, { useRef, useContext, useEffect, useState } from "react";
import { useParams, useHistory, Link, useLocation } from "react-router-dom";
import { debounce } from 'lodash'
import API from '../services/api'
import AppContext from '../services/app-context'


function Meal() {
  let params = useParams();
  let location = useLocation()
  const history = useHistory()
  const appHeader = useContext(AppContext)
  const [deleteConfirmation, setDeleteConfirmation] = useState(0)
  const [meal, setMeal] = useState({name: '', link: '', notes: ''})
  const [mealName, setMealName] = useState('')
  const [notes, setNotes] = useState('')
  const [link, setLink] = useState('')

  const isEditMode = location.pathname.split('/').pop() === 'edit'
  const loading = useRef(true)

  useEffect(() => {
    appHeader.setTitle('Loading...')
    API.get('meals?id=' + params.id)
      .then((resp) => {
        if ( resp.status === 401 ) history.push('/login')
        if (resp.meal) {
          setMeal(resp.meal)
          appHeader.setTitle(resp.meal.name)
          if ( loading.current ) {
            loading.current = false
          } else {
            console.log('inital effect run again?')
          }
        } else {

        }
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if ( loading.current ) return;
    // TODO debounce
    patch()
    
  }, [meal.name, meal.link, meal.notes])

  function patch() {
    API.patch('meals', {
      id: params.id,
      meal: meal
    }).then((resp) => {
      if ( resp.status === 401 ) history.push('/login')
      if (resp.meal) {
        console.log(resp.meal)
      } else {
        console.error(resp)
      }
    }).catch((err) => {
      console.error(err)
    })       
  }

  const debouncePatch = debounce(patch, 200)

  function handleMealChange(event) {
    const { name, value } = event.target
    setMeal((currentMeal) => ({
      ...currentMeal, [name]: value
    }))
  }

  function destroy(e) {
    e.preventDefault();
    if (deleteConfirmation === 0) {
      setDeleteConfirmation(deleteConfirmation + 1)
      return
    }

    API.delete('meals', {id: params.id})
      .then((resp) => {
        if ( resp.status === 401 ) history.push('/login')
        if (resp.deleted === 1) {
          history.replace('/meals/')
        } else {
          console.error(resp)
        }
      })
      .catch(console.error)
  }

  return (
    <div className="space-y-4">
      {meal && 
        <>
          <div className="flex justify-between">
            { isEditMode ?
              <input 
                type="text" 
                className="p-2 m-2 text-sm border border-gray-400 rounded" 
                onChange={handleMealChange} 
                name="name"
                value={meal.name} /> : 
              <h1 className="p-4 border border-transparent">{ meal.name }</h1>  
            }
            <Link
              to={`/meals/${params.id}/edit`}
              className="p-4 text-xs">Edit</Link>
          </div>
          <div>
            {meal.link && !isEditMode &&
              <a href={meal.link} className="inline-block p-4 text-blue-500">Recipe</a>
            }
            {isEditMode &&
              <input 
              type="text" 
              className="p-2 m-2 text-sm border border-gray-400 rounded" 
              onChange={handleMealChange} 
              name="link"
              value={meal.link} />
            }
            {isEditMode ?
              <textarea 
                className="p-2 m-2 text-sm border border-gray-400" 
                // onChange={ (e) => { handleMealChange(e); debouncePatch() } }
                onChange={ handleMealChange }
                name="notes"
                value={meal.notes}></textarea> : 
              <p className="p-4 text-sm border border-transparent">{meal.notes}</p>
            }
          </div>
          {isEditMode &&
            <div className="flex flex-row">
              <a
                href="#"
                onClick={destroy}
                className="inline-block p-4 text-xs text-red-500">
                {deleteConfirmation === 0 ? 'Delete' : 'Delete Now'}
              </a>
              {deleteConfirmation > 0 &&
                <a href="#" onClick={ () => { setDeleteConfirmation(0) } } className="block p-4 ml-4 text-xs text-blue-500">
                  Cancel
                </a>
              }
            </div>
          }
        </>
      }
    </div>
  )
}

export default Meal