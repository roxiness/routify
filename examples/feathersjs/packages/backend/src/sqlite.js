// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import knex from 'knex'

export const sqlite = (app) => {
  const config = app.get('sqlite')
  const db = knex(config)

  app.set('sqliteClient', db)
}
