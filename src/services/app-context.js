import React from 'react'

const defaultText = 'Meal Planner'

// const AppContext = React.createContext({
//   header: {
//     text: defaultText
//   },
//   set: () => {}
// });

export default React.createContext({
  text: defaultText,
  user: {},
  setTitle: () => {},
  setUser: () => {},
  login: () => {
    console.log('hiiii')
  }
})
