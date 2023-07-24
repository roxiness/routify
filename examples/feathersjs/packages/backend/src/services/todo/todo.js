// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  todoDataValidator,
  todoPatchValidator,
  todoQueryValidator,
  todoResolver,
  todoExternalResolver,
  todoDataResolver,
  todoPatchResolver,
  todoQueryResolver
} from './todo.schema.js'
import { TodoService, getOptions } from './todo.class.js'
import { todoPath, todoMethods } from './todo.shared.js'

export * from './todo.class.js'
export * from './todo.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const todo = (app) => {
  // Register our service on the Feathers application
  app.use(todoPath, new TodoService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: todoMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(todoPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(todoExternalResolver), schemaHooks.resolveResult(todoResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(todoQueryValidator), schemaHooks.resolveQuery(todoQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(todoDataValidator), schemaHooks.resolveData(todoDataResolver)],
      patch: [schemaHooks.validateData(todoPatchValidator), schemaHooks.resolveData(todoPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
