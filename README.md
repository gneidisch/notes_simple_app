# notes_simple_app

Requirements:
- NodeJS, npm
- PostgressSql

Steps:
1 - copy everything on a local directory
2 - create a database and an authorized user
3 - update accordingly the variable 'connectionString' at the beginning of the files 'models/database.js' and "routes/index.js"
4 - run "node models/database.js" to initialize the database
5 - run "npm install" to resolve dependencies
6 - run "npm start" to start the application

TODO:
- create a utility script file with db-calls and such
- use a single configuration file, it is cumbersome to go changing database access variables in all-scattered files
- improve sql-queries
- user-authentication!!
- include Sequelize!!
- unit testing!!

