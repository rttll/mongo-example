import { useEffect, useState, useContext } from "react";
import moment from 'moment'
import { Switch, Route, useParams, useRouteMatch, useHistory } from "react-router-dom";
import { Scroll } from 'framer'
import API from '../services/api'
import AppContext from '../services/app-context'
import { useRealmApp } from './RealmApp'

import List from './List'
import Sheet from './Sheet'

function Day() {
  window.moment = moment
  let { id } = useParams();
  const { path, url } = useRouteMatch(); 
  const history = useHistory()
  const appHeader = useContext(AppContext)
  
  const [day, setDay] = useState(null)
  const [isEditting, setIsEdditing] = useState(false)
  const [isSheetActive, setIsSheetActive] = useState(false)
  const [meals, setMeals] = useState([])
  
  const app = useRealmApp()

  useEffect(() => {    
    appHeader.setTitle('Loading...')
    // app.currentUser.functions.getAllDays(id).then((resp) => {
    //   setDay(resp)
    // })
    app.getOneDay(id).then((resp) => {
      let day = {...resp.day, ...{date: moment(resp.day.date)}}
      if (day.meals.length > 0 && day.mealOrder.length > 0) {
        day.meals = orderMeals(day.meals, day.mealOrder)
      }
      setDay(day)
      appHeader.setTitle( day.date.format('ddd, MMM') + ' ' + day.date.date() )
    }) 
    
  }, [])

  useEffect(() => {
    if ( !isSheetActive ) return;
    API.get('meals')
      .then((resp) => {
        if ( resp.status === 401 ) history.push('/login')
        setMeals(resp.meals.map((m) => {
          let inactive = day.mealIds.indexOf(m._id) > -1
          return {...m, ...{key: m._id, inactive: inactive}}
        }))
      })
      .catch((err) => console.log)
  }, [isSheetActive])  

  function orderMeals(meals, order) {
    const sorter = (a, b) => {
      let mealIndex = order.indexOf(a._id)
      let orderIndex = order.indexOf(b._id)
      let x = mealIndex < orderIndex ? -1 : 0
      return x
    }
    return meals.sort(sorter)
  }

  let sortTimer = null;
  function onSortEnd(order) {
    if ( sortTimer !== null ) clearTimeout(sortTimer)
    const startTimer = (order) => {
      sortTimer = setTimeout(saveSort, 250, order)
    }
    startTimer(order)
  }

  function saveSort(order) {
    API.patch('days', { id: id, day: {mealOrder: order}} )
      .then((resp) => {
        if ( resp.status === 401 ) history.push('/login')
      })
      .catch((err) => {console.error(err)})
  }

  function addOrRemoveMeal(event, meal) {
    event.preventDefault()
    let mealId = meal._id
    const mealIds = day.mealIds.indexOf(mealId) === -1 ? day.mealIds.concat([mealId]) : day.mealIds.filter(id => id !== mealId)
    return API.patch('days', { id: id, day: {mealIds: mealIds } } )
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
    if ( isEditting ) return;
    event.preventDefault()
    history.push(`/meals/${meal._id}`)
  }

  return (
    <>
      <Switch>
        <Route path={path}>
          {day && 
            <>
              <List
                className=""
                items={day.meals}
                sortKey={'_id'}
                onItemClicked={ goToMeal }
                deleteIconClicked={addOrRemoveMeal}
                onSortEnd={ onSortEnd }
                showActions={isEditting}
              />
              
              <span className="block p-4" onClick={ () => {setIsSheetActive(true)} }>add</span>
              <span className="block p-4" onClick={ () => {setIsEdditing(!isEditting)} }>edit</span>

              <Sheet isActive={isSheetActive} setIsActive={setIsSheetActive} title={'Meals'}>
                <Scroll height='100%' width='100%'>
                  <List
                    items={meals}
                    spacer={true}
                    onItemClicked={ addOrRemoveMeal }
                    showActions={false}
                    />
                </Scroll>
              </Sheet>
            </>
          }      
        </Route>
      </Switch>  
    </>
  )
}

export default Day