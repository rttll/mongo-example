import { createServer, Model } from 'miragejs'

export default function() {
  createServer({
    models: {
      reminder: Model
    },

    seeds(server) {
      server.create("reminder", { text: "12/3/2020" })
      server.create("reminder", { text: "12/3/2020" })
      server.create("reminder", { text: "12/3/2020" })
    },
    
    routes() {
      this.get('/api/reminders', (schema) => {
        return schema.reminders.all()
      })

      this.post('/api/reminders', (schema, request) => {
        let attrs = JSON.parse(request.requestBody)
        return schema.reminders.create(attrs)
      })

      this.patch('/api/reminders/:id', (schema, request) => {
        let id = request.params.id
        let body = JSON.parse(request.requestBody)
        return schema.reminders.find(id).update({text: body.reminder.text})
      })

      this.delete('/api/reminders/:id', (schema, request) => {
        let id = request.params.id
        return schema.reminders.find(id).destroy()
      })
    }
  })
}
