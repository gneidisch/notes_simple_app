const connectionString = process.env.DATABASE_URL || 'postgres://dbuser01:dbuser01@localhost:5432/notes_db';

const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');


/* GET home page. */
//router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
//});

router.get('/', (req, res, next) => {
    res.sendFile('index.html');
});


// post - create new note
router.post('/api/v1/notes', (req, res, next) => {
    const results = [];
    // Grab data from http request
    const data = {subject: req.body.subject, body: req.body.body};
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Insert Data

        client.query('WITH NOTE AS ( INSERT INTO t_note(subject) VALUES($1) RETURNING * ) INSERT INTO t_note_version(t_note_id, body, note_version, created) SELECT note.id, $2, 1, now() FROM NOTE;',
            [data.subject, data.body]);
 
        // SQL Query > Select Data
        const query = client.query('SELECT n.id, n.subject, nv.body, nv.note_version, nv.created FROM t_note n, t_note_version nv WHERE n.id = nv.t_note_id and nv.id = (SELECT MAX(id) FROM t_note_version WHERE t_note_id = n.id) ORDER BY n.id ASC;');
        // Stream results back one row at a time
        query.on('row', (row) => {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            return res.json(results);
        });
    });
});


// get - get'em all notes
router.get('/api/v1/notes', (req, res, next) => {
    const results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
 
        // SQL Query > Select Data
        const query = client.query('SELECT n.id, n.subject, nv.body, nv.note_version, nv.created FROM t_note n, t_note_version nv WHERE n.id = nv.t_note_id and nv.id = (SELECT MAX(id) FROM t_note_version WHERE t_note_id = n.id) ORDER BY n.id ASC;');
        // Stream results back one row at a time
        query.on('row', (row) => {
            results.push(row);
        });
    
        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            return res.json(results);
        });
    });
});


// put - update a note
router.put('/api/v1/notes/:note_id/:note_body', (req, res, next) => {
    const results = [];
    const data = {id: req.params.note_id, body: req.params.note_body};
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Create a new version of the note
        client.query('INSERT INTO t_note_version (t_note_id, body, note_version, created) VALUES ($1, $2, (SELECT MAX(t1.note_version)+1 FROM t_note_version t1 WHERE t1.t_note_id = $3), now());',
            [data.id, data.body, data.id]);
        
        // SQL Query > Select Data
        const query = client.query('SELECT n.id, n.subject, nv.body, nv.note_version, nv.created FROM t_note n, t_note_version nv WHERE n.id = nv.t_note_id and nv.id = (SELECT MAX(id) FROM t_note_version WHERE t_note_id = n.id) ORDER BY n.id ASC;');
        // Stream results back one row at a time
        query.on('row', (row) => {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});


// delete - delete a note
router.delete('/api/v1/notes/:note_id', (req, res, next) => {
    const results = [];
    // Grab data from the URL parameters
    const id = req.params.note_id;
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Delete Data
        client.query('DELETE FROM t_note_version WHERE t_note_id=($1)', [id]);
        client.query('DELETE FROM t_note WHERE id=($1)', [id]);

        // SQL Query > Select Data
        var query = client.query('SELECT n.id, n.subject, nv.body, nv.note_version, nv.created FROM t_note n, t_note_version nv WHERE n.id = nv.t_note_id and nv.id = (SELECT MAX(id) FROM t_note_version WHERE t_note_id = n.id) ORDER BY n.id ASC;');
        // Stream results back one row at a time
        query.on('row', (row) => {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            return res.json(results);
        });
    });
});





module.exports = router;
