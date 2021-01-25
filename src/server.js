import { belongsTo, createServer, hasMany, Model } from 'miragejs'
import moment from 'moment'

function include(record, associationName) {
  const children = record[associationName].models.map(m => m.attrs)
  let association = {}
  association[associationName] = children
  return {...record.attrs, ...association}
}

function Server() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  createServer({
    models: {
      meal: Model,
      day: Model.extend({
        meals: hasMany(),
        week: belongsTo()
      }),
      week: Model.extend({
        days: hasMany()
      })
    },

    seeds(server) {
      server.create("meal", { text: "Meal 1" })
      server.create("meal", { text: "Meal 2" })
      server.create("meal", { text: "Meal 3" })
    },
    
    routes() {

      // GET /days
      this.get('/api/days', (schema) => {
        let all = schema.weeks.all()
        return all.models.map((week) => {
          let attrs = week.attrs
          attrs.days = week.days.models
          return attrs
        })
      })
      
      // GET /day/:id
      this.get('/api/days/:id', (schema, request) => {
        let day = schema.days.find(request.params.id)
        if (day === null) {
          day = schema.days.create({
            date: moment()
          })
        }
        // day.mealIds = [1, 2]
        const meals = day.meals.models.map(m => m.attrs)
        return {...day.attrs, ...{meals: meals}}
      })
      
      // POST days/batch
      this.post('/api/days/batch', (schema, request) => {
        const dates = JSON.parse(request.requestBody).dates
        let days = []
        for (const date of dates) {
          const day = schema.days.findOrCreateBy({date: date})
          days.push(day)
        }
        return days
      })

      // PATCH day
      this.patch('/api/days/:id', (schema, request) => {
        let day = schema.days.find(request.params.id)
        let body = JSON.parse(request.requestBody)
        if ( body.add_meal ) {
          let meal = schema.meals.find(body.add_meal)
          console.log('meals', schema.meals.all(), meal)
          day.meals.add(meal)
          day.meals.add(schema.meals.create({ text: "Meal 4" }))
          console.log(day.meals)
          return include(day, 'meals')
        } else {
          let updates = {day, ...body.day}
          return day.update(updates)
        }
      })

      // GET /meals
      this.get('/api/meals', (schema) => {
        return schema.meals.all()
      })
      
      // POST /meals
      this.post('/api/meals', (schema, request) => {
        let attrs = JSON.parse(request.requestBody)
        return schema.meals.create(attrs)
      })

      this.patch('/api/meals/:id', (schema, request) => {
        let id = request.params.id
        let body = JSON.parse(request.requestBody)
        return schema.meals.find(id).update({text: body.meal.text})
      })

      this.delete('/api/meals/:id', (schema, request) => {
        let id = request.params.id
        return schema.meals.find(id).destroy()
      })
    }
  })
}

export default Server