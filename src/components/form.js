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