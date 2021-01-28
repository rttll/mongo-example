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
    y: 0,
    transition: {
      ease: 'easeOut',
    }
  },
  hidden: { 
    y: '100%',
    transition: {
      ease: 'easeIn',
    }
  },
}


module.exports = { list, slideUp }