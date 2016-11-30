const connectionString = process.env.DATABASE_URL || 'postgres://dbuser01:dbuser01@localhost:5432/notes_db';


const pg = require('pg');

const client = new pg.Client(connectionString);
client.connect();
const query = client.query('CREATE TABLE t_note(id SERIAL PRIMARY KEY, subject VARCHAR(80) NOT NULL); CREATE TABLE t_note_version(id SERIAL PRIMARY KEY, t_note_id INT REFERENCES t_note(id) ON DELETE CASCADE ON UPDATE CASCADE, body VARCHAR, note_version INT, created TIMESTAMP DEFAULT NOW()); CREATE TABLE t_user (id SERIAL PRIMARY KEY,  email VARCHAR, password VARCHAR);');
query.on('end', () => { client.end(); });

