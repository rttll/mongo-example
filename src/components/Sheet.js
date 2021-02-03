import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { Frame, Stack, AnimatePresence, useAnimation } from 'framer'
import { slideUp } from '../util/motion'

function Sheet(props) { 
  const controls = useAnimation()
  const dragThreshold = 50;
  let initialDragPoint = null;
  let distanceDragged = 0;
  let opacity = 1;
  
  useEffect(() => {
    if ( props.isActive ) {
      body.style.overflow = 'hidden'
      controls.start('visible')
    } else {
      body.style.overflow = 'auto'
    }
  }, [props.isActive])
  
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
      props.setIsActive(false)
    } else {
      opacity = 1
      setOpacity()
      controls.set('visible')
    }
  }
  
  const body = document.getElementsByTagName('body')[0]
    
  return (
    <>
      {props.isActive &&
        <motion.div
          animate={{opacity: 0.3}}
          initial={{opacity: 0}}
          exit={{opacity: 0}}
          transition={{ duration: 0.3, type: "tween" }}
          onClick={(e) => props.setIsActive(false)}
          className="fixed inset-0 z-30 bg-gray-700"
        />
      }

      <AnimatePresence>
        {props.isActive &&
          <Frame
            id="drawer"
            backgroundColor="transparent"
            className="z-30 rounded-t-xl"
            height={document.documentElement.clientHeight}
            width={document.documentElement.clientWidth}
            animate={controls}
            initial={{y: document.documentElement.clientHeight, opacity: 1}}
            exit={{y: document.documentElement.clientHeight, opacity: 1}}
            transition={{type: 'tween'}}
            variants={{
              visible: {y: document.documentElement.clientHeight * 0.3, opacity: 1}
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
                    <h1 className="p-4 font-medium">{props.title || 'You need a title'}</h1>
                    <span className="p-4" onClick={() => {props.setIsActive(false)}}>&times;</span>
                  </div>
                </div>
              </Frame>
              
              {props.children}

            </Stack>
          </Frame>
        }
      </AnimatePresence>
    </>    
  )
}

export default Sheet