const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://dbuser01:dbuser01@localhost:5432/notes_db';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE t_note(id SERIAL PRIMARY KEY, subject VARCHAR(80) NOT NULL, body VARCHAR, note_version INT)');
query.on('end', () => { client.end(); });

