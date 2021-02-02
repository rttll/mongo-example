import React, { useEffect, useState, useContext } from "react";
import moment from 'moment'
import API from '../services/api'
import AppContext from '../services/app-context'

import { Switch, Route, Link, useParams, useRouteMatch, useHistory } from "react-router-dom";
import MealList from './MealList'
import { AnimatePresence, motion } from "framer-motion";
import { Frame, Stack, Scroll } from 'framer'
import { slideUp } from '../util/motion'
import Sortable from "sortablejs";

// Classnames need to be stored explicity, or PurgeCSS will not include them.
const bgClasses = [
  'bg-green-100',
  'bg-green-200',
  'bg-green-300',
  'bg-green-400',
  'bg-green-500',
  // 'bg-green-600',
  // 'bg-green-700',
]



function Day() {
  let { action, slug } = useParams();
  const history = useHistory()
  const { path, url } = useRouteMatch(); 
  const [day, setDay] = useState(null)
  const [meals, setMeals] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [sortable, setSortable] = useState(null)
  const context = useContext(AppContext)

  const bgName = (index) => {
    let max = bgClasses.length - 1
    if (index > max) index = max
    let klass = bgClasses[index]
    return klass
  }

  const body = document.getElementsByTagName('body')[0]

  useEffect(() => {
    if ( isAdding ) {
      body.style.overflow = 'hidden'
    } else {
      body.style.overflow = 'auto'
    }
  }, [isAdding])

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

  function addOrRemoveMeal(event, mealId) {
    event.preventDefault()
    const mealIds = day.mealIds.indexOf(mealId) === -1 ? day.mealIds.concat([mealId]) : day.mealIds.filter(id => id !== mealId)
    API.patch('days', { id: slug, day: {mealIds: mealIds } } )
      .then((resp) => {
        if (resp.day) {
          setDay({...resp.day, ...{date: moment(resp.day.date)}})
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
                    <a href="#" onClick={ (event) => addOrRemoveMeal(event, meal._id) } className="flex items-center px-4 ">
                      <span>&times;</span>
                    </a>
                  </li>
                )
              }
            </ul>
            <a href="" className="block p-4" onClick={(e) => {e.preventDefault(); setIsAdding(true)} }>Add</a>

          </div>
        
          {day && isAdding && 
            <Stack
              direction='vertical'
              gap={0}
              width={'100%'}
              animate={{y: 0, opacity: 1}}
              initial={{y: 100, opacity: 0}}
              className="z-30"
              >
            
              <Frame
                className="z-30 opacity-30"
                width={'100%'}
                backgroundColor="#222"
                height={100}
                onClick={(e) => setIsAdding(false)}
                data-spacer>
              </Frame>
              <Frame
                className="rounded-t-xl"
                width={'100%'}
              >
                <Stack
                  gap={0}
                  width={'100%'}
                >
                  <Frame
                    height={50}
                    width={'100%'}
                    backgroundColor="#fff"
                    className="rounded-t-xl"
                  >
                    <div className="relative flex h-full shadow-md">
                      <div className="absolute top-0 z-10 w-full h-4 opacity-30" style={{background: '#222'}}></div>
                      <div className="z-20 flex items-center justify-between flex-grow bg-white border border-gray-300 rounded-t-xl">
                        <h1 className="p-4 font-medium">Meals</h1>
                        <span className="p-4" onClick={() => {setIsAdding(false)}}>&times;</span>
                      </div>
                    </div>
                  </Frame>
                    <MealList 
                      exclude={day.mealIds} 
                      closeSelf={(e) => setIsAdding(false)}
                      onItemClick={ addOrRemoveMeal }
                      className="bg-white"
                    />
                </Stack>
              </Frame>
            </Stack>
          }
        
        </Route>
      </Switch>  
    </>
  )
}

export default Day