// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const todoSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String(),
    done: Type.Boolean()
  },
  { $id: 'Todo', additionalProperties: false }
)
export const todoValidator = getValidator(todoSchema, dataValidator)
export const todoResolver = resolve({})

export const todoExternalResolver = resolve({})

// Schema for creating new entries
export const todoDataSchema = Type.Pick(todoSchema, ['text'], {
  $id: 'TodoData'
})
export const todoDataValidator = getValidator(todoDataSchema, dataValidator)
export const todoDataResolver = resolve({})

// Schema for updating existing entries
export const todoPatchSchema = Type.Partial(todoSchema, {
  $id: 'TodoPatch'
})
export const todoPatchValidator = getValidator(todoPatchSchema, dataValidator)
export const todoPatchResolver = resolve({})

// Schema for allowed query properties
export const todoQueryProperties = Type.Pick(todoSchema, ['id', 'text', 'done'])
export const todoQuerySchema = Type.Intersect(
  [
    querySyntax(todoQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const todoQueryValidator = getValidator(todoQuerySchema, queryValidator)
export const todoQueryResolver = resolve({})
