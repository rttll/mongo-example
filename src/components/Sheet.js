import { useEffect } from "react";
import { motion } from "framer-motion";
import { Frame, Stack, AnimatePresence, useAnimation } from 'framer'

function Sheet(props) { 
  const controls = useAnimation()
  const dragThreshold = 50;
  let initialDragPoint = null;
  let distanceDragged = 0;
  
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
  }
  
  function onDrageEnd(event, info) {
    if ( distanceDragged > dragThreshold ) {
      props.setIsActive(false)
    } else {
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
            data-sheet
            backgroundColor="#fff"
            className="z-30 rounded-t-xl"
            height={400}
            width={document.documentElement.clientWidth}
            style={{top: window.innerHeight - 400}}
            animate={controls}
            initial={{y: 400}}
            exit={{y: document.documentElement.clientHeight}}
            transition={{type: 'tween'}}
            variants={{
              visible: {y: 0}
            }}                  
            drag={'y'}
            dragConstraints={{ top: 0, bottom: 50 }}
            dragTransition={{min: 0, max: 10, power: 0.1} }
            onDragStart={onDragStart}
            onDragEnd={onDrageEnd}
            onDrag={onDrag}
          >
            <Stack
              gap={0}
              width={document.documentElement.clientWidth}
              height={'100%'}
              className="border border-gray-300 rounded-t-xl"
              >
              <Frame
                id="header"
                height={50}
                width={document.documentElement.clientWidth}
                className="rounded-t-xl"
                backgroundColor="transparent"
              >
                <div className="relative flex items-center justify-between h-full shadow-md" >
                  <h1 className="max-h-full p-4 font-medium leading-none text-gray-700">
                    {props.title || 'You need a title'}</h1>
                  <span 
                    className="max-h-full p-4 leading-none" 
                    onClick={() => {props.setIsActive(false)}}>&times;</span>
                  <i style={{height: '8px'}} className="absolute bottom-0 left-0 z-20 w-full border-b border-gray-200 shadow-md opacity-60"></i>
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