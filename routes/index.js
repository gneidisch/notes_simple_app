const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://dbuser01:dbuser01@localhost:5432/notes_db';


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
    const data = {subject: req.body.subject, body: ""};
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query('INSERT INTO t_note(subject, body) values($1, $2)',
        [data.subject, data.body]);
 
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM t_note ORDER BY id ASC');
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
        const query = client.query('SELECT * FROM t_note ORDER BY id ASC;');
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


router.put('/api/v1/notes/:note_id', (req, res, next) => {
    const results = [];
    // Grab data from the URL parameters
    const id = req.params.note_id;
    // Grab data from http request
    const data = {subject: req.body.suject, body: req.body.body};
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Update Data
        client.query('UPDATE t_note SET subject=($1), body=($2), note_version=note_version+1 WHERE id=($3)',
        [data.subject, data.body, id]);
        
        // SQL Query > Select Data
        const query = client.query("SELECT * FROM t_note ORDER BY id ASC");
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
        client.query('DELETE FROM t_note WHERE id=($1)', [id]);

        // SQL Query > Select Data
        var query = client.query('SELECT * FROM t_note ORDER BY id ASC');
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