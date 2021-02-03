import React, { useEffect, useState, useContext } from "react";
import moment from 'moment'
import { Switch, Route, useParams, useRouteMatch, useHistory } from "react-router-dom";
import { Stack, Frame } from 'framer'
import API from '../services/api'
import AppContext from '../services/app-context'

import List from './List'
import Sheet from './Sheet'

function Day() {
  let { action, slug } = useParams();
  const { path, url } = useRouteMatch(); 
  const history = useHistory()
  const context = useContext(AppContext)
  
  const [day, setDay] = useState(null)
  
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
    event.preventDefault()
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

  function goToMeal(event, meal) {
    event.preventDefault()
    history.push(`/meals/${meal._id}`)
  }

  return (
    <>
      <Switch>
        <Route path={path}>
          {day && 
            <>
              <Stack width={window.innerWidth}>
                <List
                  data-list
                  items={day.meals}
                  onItemClick={ goToMeal }
                />
                <Frame width={window.innerWidth} height={50} backgroundColor="transparent">
                  <a href="" className="block p-4" onClick={(e) => {e.preventDefault(); setIsSheetActive(true)} }>Add</a>
                </Frame>
              </Stack>
            
              <Sheet isActive={isSheetActive} setIsActive={setIsSheetActive} title={'Meals'}>
                <List
                  data-list
                  items={meals}
                  onItemClick={ addOrRemoveMeal }
                />
              </Sheet>
            </>
          }      
        </Route>
      </Switch>  
    </>
  )
}

export default Day