import * as React from "react";
import { Frame, useMotionValue, useTransform } from "framer";

export function Slider({
  min = 0,
  max = 0, 
  value = 0,
  onChange
}) {
  const position = useMotionValue(value * 130)
  const newValue = useTransform(position, [0, 130], [min, max])
  return (
    <>
      <Frame
        name={"Rail"}
        width={130}
        height={6}
        center
        radius={3}
        background={"rgba(255, 255, 255, 0.3)"}
      >
        <Frame
          name={"Fill"}
          width={position}
          height={6}
          radius={3}
          background={"#fff"}
        />
        <Frame
          name={"Knob"}
          size={40}
          center={"y"}
          radius={"50%"}
          background={"#fff"}
          left={-20}
          drag={"x"}
          x={position}
          dragConstraints={{left: 0, right: 130}}
          dragElastic={0}
          dragMomentum={false}
          onDrag={function() {
            if (onChange) onChange(newValue.get())
          }}
        />

      </Frame>
    </>
  )
}
