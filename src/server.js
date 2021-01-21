import { belongsTo, createServer, hasMany, Model } from 'miragejs'

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
      
      const week = server.create("week", { start: Date.now() })
      days.forEach((day) => {
        server.create("day", { text: day, week: week })
      })
    },
    
    routes() {

      // GET /weeks
      this.get('/api/weeks', (schema) => {
        let all = schema.weeks.all()
        return all.models.map((week) => {
          let attrs = week.attrs
          attrs.days = week.days.models
          return attrs
        })
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

      // PATCH days
      this.patch('/api/days/:id', (schema, request) => {
        let day = schema.days.find(request.params.id)
        let body = JSON.parse(request.requestBody)
        let updates = {day, ...body.day}
        return schema.days.find(id).update(updates)
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