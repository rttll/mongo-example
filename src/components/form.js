import API from '../services/api'

const [addingMeal, setAddingMeal] = useState(false)
  const [mealName, setMealName] = useState('')

function createMeal(e) {
  e.preventDefault();

  if ( addingMeal ) return;
  setAddingMeal(true)
  
  API.post('meals', {name: mealName})
    .then(meal => {
      setMeals(meals.concat([meal]))
      setMealName('')
    })
    .catch((err) => {
      console.error(err)
    })
    .finally(() => {
      setAddingMeal(false)
    })
}

{/* <form action="/meals" onSubmit={createMeal}>
          <div className="flex justify-between border-b border-gray-300">
            <input 
              type="text" 
              className="block w-full p-4"
              value={mealName}
              onChange={ (e) => setMealName(e.target.value) }
              placeholder="Create new meal"
            />
            <button type="submit" className="p-4">+</button>
          </div>
        </form>


<Frame height={200} backgroundColor="transparent">
        <form action="/meals" onSubmit={createMeal}>
          <div className="flex justify-between border-b border-gray-300">
            <input 
              type="text" 
              className="block w-full p-4"
              value={mealName}
              onChange={ (e) => setMealName(e.target.value) }
              placeholder="Create new meal"
            />
            <button type="submit" className="p-4">+</button>
          </div>
        </form>        
      </Frame> */}