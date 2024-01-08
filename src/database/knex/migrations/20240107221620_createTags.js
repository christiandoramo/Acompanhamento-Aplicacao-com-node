// para rodar - npx knex migrate:latest - isso sem crair script no package.json
function up(knex) {
    return knex.schema.createTable('tags', (table) => {
        table.increments('id')
        table.text('name').notNullable()
        table.integer('note_id').references('id').inTable('notes').onDelete('CASCADE')
        table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

function down(knex) {
    return knex.schema.dropTable('tags')
}
export { up, down }