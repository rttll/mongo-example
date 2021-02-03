import React, { useEffect, useState, useContext } from "react";
import moment from 'moment'
import API from '../services/api'
import AppContext from '../services/app-context'

import { Switch, Route, Link, useParams, useRouteMatch, useHistory } from "react-router-dom";
import List from './List'
import Sheet from './Sheet'
import Sortable from "sortablejs";

function Day() {
  let { action, slug } = useParams();
  const { path, url } = useRouteMatch(); 
  const history = useHistory()
  const context = useContext(AppContext)
  
  const [day, setDay] = useState(null)
  const [sortable, setSortable] = useState(null)
  
  const [isSheetActive, setIsSheetActive] = useState(false)
  const [meals, setMeals] = useState([])

  useEffect(() => {
    context.set('Loading...')
    if ( action === 'show' ) {
      get()
    } else {
      create()
    }
   
  }, [])

  useEffect(() => {
    if ( day ) initSort()
  }, [day])

  useEffect(() => {
    API.get('meals')
      .then((resp) => {
        setMeals(resp.meals.map((m) => {
          let inactive = day.mealIds.indexOf(m._id) > -1
          return {...m, ...{key: m._id, inactive: inactive}}
        }))
      })
      .catch((err) => console.log)
  }, [isSheetActive])  

  function formatAndSetDay(day) {
    let base = {...day, ...{date: moment(day.date)}}
    const sorter = (a, b) => {
      let mealIndex = base.mealOrder.indexOf(a._id)
      let orderIndex = base.mealOrder.indexOf(b._id)
      let x = mealIndex < orderIndex ? -1 : 0
      return x
    }
    if (base.meals.length > 0 && base.mealOrder.length > 0) {
      base.meals = base.meals.sort(sorter)
    }
    setDay(base)
  }

  function create() {
    let date = moment(parseInt(slug))
    API.post('days', {date: date.valueOf()})
    .then(resp => {
        setDay({...resp.day, ...{date: date}})
        context.set(date.format('dddd'))
        history.replace(`/days/show/${resp.day._id}`)
      })
    .catch(console.log)
  }

  function get() {
    API.get('days?id=' + slug)
    .then((resp) => {
      formatAndSetDay(resp.day)
      context.set(moment(resp.day.date).format('dddd, MMM D'))
    })
    .catch(console.error)
  }

  function update(data) {
    API.patch('days', { id: slug, day: data } )
    .then((resp) => {
      if (resp.day) {
        formatAndSetDay(resp.day)
      } else {
        console.error('then err', resp)
      }
    }).catch((err) => {
      console.error('catch err', err)
    })
  }

  function addOrRemoveMeal(event, meal) {
    let mealId = meal._id
    const mealIds = day.mealIds.indexOf(mealId) === -1 ? day.mealIds.concat([mealId]) : day.mealIds.filter(id => id !== mealId)
    return API.patch('days', { id: slug, day: {mealIds: mealIds } } )
      .then((resp) => {
        if (resp.day) {
          setDay({...resp.day, ...{date: moment(resp.day.date)}})
          return () => {
            event.target.classList.add('line-through')
            event.target.classList.add('text-gray-300')
          }
        } else {
          console.error('then err', resp)
        }
      }).catch((err) => {
        console.error('catch err', err)
      })
  }

  function initSort() {
    if ( sortable ) return;
    const container = document.getElementById('meal-list')
    setSortable(
      Sortable.create(container, {
        dragClass: 'bg-gray-300',
        ghostClass: 'bg-green-100',
        onEnd: function(e) {
          if ( e.newDraggableIndex !== e.oldDraggableIndex ) {
            let order = [].slice.call(e.from.children).map(el => parseInt(el.dataset.id))
            update({mealOrder: order})
          }
        }
      })
    );
  }

  return (
    <>
      <Switch>
        <Route path={path}>
          <div className="absolute inset-0 z-10">
            <ul id="meal-list">
              { day && day.meals.length > 0 &&
                day.meals.map((meal, index) => 
                  <li key={meal._id} data-id={meal._id} className={`border-b border-gray-300 flex items-stretch`}>
                    <Link to={`/meals/${meal._id}`} className={`block p-4 flex-grow`}>
                      {meal.name}
                    </Link>
                    <a href="#" onClick={ (event) => addOrRemoveMeal(event, meal) } className="flex items-center px-4 ">
                      <span>&times;</span>
                    </a>
                  </li>
                )
              }
            </ul>
            { day && 
              <a href="" className="block p-4" onClick={(e) => {e.preventDefault(); setIsSheetActive(true)} }>Add</a>
            }
          </div>

          { day && 
            <Sheet isActive={isSheetActive} setIsActive={setIsSheetActive} title={'Meals'}>
              <List
                data-list
                items={meals}
                // closeSelf={(e) => setIsAdding(false)}
                onItemClick={ addOrRemoveMeal }
              />
            </Sheet>
          }  
                
        </Route>
      </Switch>  
    </>
  )
}

export default Day