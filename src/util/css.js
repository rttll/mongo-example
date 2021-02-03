const bgName = (index) => {
  let max = bgClasses.length - 1
  if (index > max) index = max
  let klass = bgClasses[index]
  return klass
}

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

export { bgClasses }