import { belongsTo, createServer, hasMany, Model } from 'miragejs'
import moment from 'moment'
function include(record, associationName) {

}

function Server() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  createServer({
    models: {
      meal: Model,
      day: Model.extend({
        meal: hasMany(),
        week: belongsTo()
      }),
      week: Model.extend({
        days: hasMany()
      })
    },

    seeds(server) {
      server.create("meal", { text: "Meal 1" })
      server.create("meal", { text: "Meal 1" })
      server.create("meal", { text: "Meal 2" })
      
      let start = moment()
      // days.forEach((day) => {
      //   server.create("day", { text: day, week: week })
      // })
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

      this.post('/api/days/batch', (schema, request) => {
        const dates = JSON.parse(request.requestBody).dates
        let days = []
        for (const date of dates) {
          days.push(schema.days.findOrCreateBy({date: date}))
        }
        return days
      })

      // PATCH day
      this.patch('/api/days/:id', (schema, request) => {
        let day = schema.days.find(request.params.id)
        let body = JSON.parse(request.requestBody)
        let updates = {day, ...body.day}
        return day.update(updates)
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