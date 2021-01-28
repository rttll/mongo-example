const list = {
  visible: i => ({
     opacity: 1, 
     y: 0,
     transition: {
       delay: i * 0.0001,
     }
  }),
  hidden: i => ({ 
    opacity: 0,
    y: -50 * i
  })
}

const slideUp = {
  visible: {
    // opacity: 1,
    y: 0,
    transition: {
      // duration: 4,
      ease: 'easeOut',
    }
  },
  hidden: offset => ({ 
    y: offset,
    // y: '100%',
    // opacity: 0,
    transition: {
      // duration: 4,
      ease: 'easeIn',
    }
  }),
}


module.exports = { list, slideUp }