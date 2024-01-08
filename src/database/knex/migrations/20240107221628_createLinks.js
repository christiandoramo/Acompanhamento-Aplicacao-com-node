// para rodar - npx knex migrate:latest - isso sem crair script no package.json
function up(knex) {
    return knex.schema.createTable('links', (table) => {
        table.increments('id')
        table.text('url').notNullable()
        table.integer('note_id').references('id').inTable('notes').onDelete('CASCADE')
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
}

function down(knex) {
    return knex.schema.dropTable('links')
}
export { up, down }