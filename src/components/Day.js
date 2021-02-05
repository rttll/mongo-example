import { useEffect, useState, useContext } from "react";
import moment from 'moment'
import { Switch, Route, useParams, useRouteMatch, useHistory } from "react-router-dom";
import { Scroll } from 'framer'
import API from '../services/api'
import AppContext from '../services/app-context'

import List from './List'
import Sheet from './Sheet'

function Day() {
  let { action, slug } = useParams();
  const { path, url } = useRouteMatch(); 
  const history = useHistory()
  const appHeader = useContext(AppContext)
  
  const [day, setDay] = useState(null)
  const [isEditting, setIsEdditing] = useState(false)
  const [isSheetActive, setIsSheetActive] = useState(false)
  const [meals, setMeals] = useState([])
  
  useEffect(() => {    
    appHeader.setTitle('Loading...')
    if ( action === 'show' ) {
      get()
    } else {
      create()
    }
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
        if ( resp.status === 401 ) history.push('/login')
        setDay({...resp.day, ...{date: date}})
        appHeader.setTitle(date.format('dddd'))
        history.replace(`/days/show/${resp.day._id}`)
      })
    .catch(console.log)
  }

  function get() {
    API.get('days?id=' + slug)
    .then((resp) => {
      if ( resp.status === 401 ) history.push('/login')
      formatAndSetDay(resp.day)
      appHeader.setTitle(moment(resp.day.date).format('dddd, MMM D'))
    })
    .catch(console.error)
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
    API.patch('days', { id: slug, day: {mealOrder: order}} )
      .then((resp) => {
        if ( resp.status === 401 ) history.push('/login')
      })
      .catch((err) => {console.error(err)})
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