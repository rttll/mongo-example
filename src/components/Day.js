import React, { useEffect, useState, useContext } from "react";
import moment from 'moment'
import API from '../services/api'
import AppContext from '../services/app-context'

import { Switch, Route, Link, useParams, useRouteMatch, useHistory } from "react-router-dom";
import MealList from './MealList'
import { motion } from "framer-motion";
import { Frame, Stack, AnimatePresence, useAnimation } from 'framer'
import { slideUp } from '../util/motion'
import Sortable from "sortablejs";

function Day() {
  let { action, slug } = useParams();
  const history = useHistory()
  const { path, url } = useRouteMatch(); 
  const [day, setDay] = useState(null)
  const [meals, setMeals] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [sortable, setSortable] = useState(null)
  const context = useContext(AppContext)

  const controls = useAnimation()
  const dragThreshold = 50;
  let initialDragPoint = null;
  let distanceDragged = 0;
  let opacity = 1;

  function onDragStart(event, info) {
    if ( initialDragPoint === null) initialDragPoint = info.point.y
  }

  function onDrag(event, info) {
    distanceDragged = info.point.y - initialDragPoint
    opacity = Math.max(1 - ( distanceDragged / dragThreshold) + .4, 0.3)
    setOpacity()
  }
  
  function setOpacity() {
    document.getElementById('header').style.opacity = opacity
    document.getElementById('items').style.opacity = opacity
  }
  
  function onDrageEnd(event, info) {
    if ( distanceDragged > dragThreshold || opacity < 0.5 ) {
      setIsAdding(false)
    } else {
      opacity = 1
      setOpacity()
      controls.set('visible')
    }
  }
  
  const body = document.getElementsByTagName('body')[0]

  function dimensions() {
    return {
      height: document.documentElement.clientHeight,
      width:  document.documentElement.clientWidth,
      initial: document.documentElement.clientHeight,
    }
  }


  useEffect(() => {
    if ( isAdding ) {
      body.style.overflow = 'hidden'
      controls.start('visible')
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
              <motion.div
              id="bg"
              animate={{opacity: 0.3}}
              initial={{opacity: 0}}
              exit={{opacity: 0}}
              transition={{ duration: 0.3, type: "tween" }}
              onClick={(e) => setIsAdding(false)}
              className="fixed inset-0 z-30 bg-gray-700"
              />
            }

          
          <AnimatePresence>
            {day && isAdding && 
            

                <Frame
                  id="drawer"
                  backgroundColor="transparent"
                  className="z-30 rounded-t-xl"
                  height={dimensions().height}
                  width={dimensions().width}
                  animate={controls}
                  initial={{y: dimensions().initial, opacity: 1}}
                  exit={{y: dimensions().initial, opacity: 1}}
                  transition={{type: 'tween'}}
                  variants={{
                    visible: {y: dimensions().height * 0.3, opacity: 1}
                  }}                  
                  // drag={'y'}
                  dragConstraints={{ top: 0, bottom: 50 }}
                  dragTransition={{min: 0, max: 10, power: 0.1} }
                  onDragStart={onDragStart}
                  onDragEnd={onDrageEnd}
                  onDrag={onDrag}
                >
                  <Stack
                    gap={0}
                    width={'100%'}
                  >
                    <Frame
                      id="header"
                      height={50}
                      width={'100%'}
                      className="rounded-t-xl"
                    >
                      <div className="relative flex h-full shadow-md">
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
                    />
                  </Stack>
                </Frame>
            }
          </AnimatePresence>       
        
        </Route>
      </Switch>  
    </>
  )
}

export default Day