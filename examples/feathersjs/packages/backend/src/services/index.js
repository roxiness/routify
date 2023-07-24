import { todo } from './todo/todo.js'

export const services = (app) => {
  app.configure(todo)

  // All services will be registered here
}
