export async function up(knex) {
  await knex.schema.createTable('todo', (table) => {
    table.increments('id')
    table.string('text')
    table.boolean('done')
  })

  // seed the table
  await knex('todo').insert({ text: 'Learn Routify', done: false})
  await knex('todo').insert({ text: 'Learn Feathers', done: false})
  await knex('todo').insert({ text: 'Learn Svelte', done: false})
}

export async function down(knex) {
  await knex.schema.dropTable('todo')
}
