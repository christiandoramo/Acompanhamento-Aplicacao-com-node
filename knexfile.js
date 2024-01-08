// Para rodar o knex ->
// npm install knex --save (pois nao salva nas dependencioas por padrao...)
// npx knex init - gera o novo knexfile
// npx knex migrate:make <nome da migration>

// pool: {
//   afterCreate: (connection, callback) => connection.run("PRAGMA foreign_keys = ON", callback)
// },
// Habilita o uso do delete onCascade no sqlite

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'src', 'database', 'database.db')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'knex', 'migrations')
    },
    pool: {
      afterCreate: (connection, callback) => connection.run("PRAGMA foreign_keys = ON", callback)
    },
  },
}

export default config