
import { useState } from 'react'
import { Frame, Scroll, useCycle } from "framer"
import './App.css';
import { Slider } from './Slider'


function App() {
  const [scale, setScale] = useState(0.5)
  const constraint = (480 * scale - 120) / 2
  return (
    <Frame
      name={"SliderApp"}
      width={"100%"}
      height={"100%"}
      background={"#242424"}
      >
      <Frame
        name={"Mask"}
        size={120}
        center 
        y={"-100px"}
        overflow={"hidden"}
        radius={"50%"}
        className={"bg-red-500"}
        >
        <Frame
          name={"Image"}
          scale={scale}
          center
          size={480}
          image={"https://static.framer.com/api/bg.jpg"}
          drag
          dragElastic={0}
          dragMomentum={false}
          dragConstraints={{
            top: -constraint,
            right: constraint, 
            bottom: constraint,
            left: -constraint
          }}
        />
      </Frame>
      <Slider
        value={scale}
        min={0.25}
        max={0.75}
        onChange={function(newValue) {
          setScale(newValue)
        }}
       />
    </Frame>
  )
}

export default App;
