var pg = require('pg');
var conString = 'postgres://dbuser01:dbuser01@localhost:5432/notes_db';

function User() {
    this.u_id = 0;
    this.email = "";
    this.password= "";
    
    this.save = function(callback) {
        var client = new pg.Client(conString);
        client.connect();

        client.query('INSERT INTO t_user(email, password) VALUES($1, $2)', [this.email, this.password], function (err, result) {
            if (err) {
                console.log(err);
                return console.error('error running query', err);
            }
            console.log(result.rows);
        });
        client.query('SELECT * FROM users ORDER BY id DESC LIMIT 1', null, function(err, result) {
            if (err) {
                return callback(null);
            }
            if (result.rows.length > 0) {
                console.log(result.rows[0] + ' is found!');
                var user = new User();
                user.email= result.rows[0]['email'];
                user.password = result.rows[0]['password'];
                user.u_id = result.rows[0]['u_id'];
                console.log(user.email);
                client.end();
                return callback(user);
            }
        });
        

    };

}

User.findOne = function(email, callback) {
    var client = new pg.Client(conString);
    var isNotAvailable = false;

    client.connect();
    client.query("SELECT * FROM t_user WHERE email=$1", [email], function(err, result) {
        if (err) {
            return callback(err, isNotAvailable, this);
        }

        if (result.rows.length > 0) {
            isNotAvailable = true;

            console.log(email + ' is am not available!');
        } else {
            isNotAvailable = false;
            console.log(email + ' is available');
        }

                 
        client.end();
        return callback(false, isNotAvailable, this);

    });
};

User.findById = function(id, callback){
    var client = new pg.Client(conString);
    client.connect();
    client.query("SELECT * FROM t_user WHERE id=$1", [id], function(err, result) {
        if (err) {
            return callback(err, null);
        }
        if (result.rows.length > 0) {
            console.log(result.rows[0] + ' is found!');
            var user = new User();
            user.email= result.rows[0]['email'];
            user.password = result.rows[0]['password'];
            user.id = result.rows[0]['u_id'];
            console.log(user.email);
            return callback(null, user);
        }
    });
};


module.exports = User;
