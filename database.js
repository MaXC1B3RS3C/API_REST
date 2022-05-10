var sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcryptjs')

function bcrypthashing(password) {
	return bcrypt.hashSync(password, 10);
}
const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
                db.run(insert, ["admin","admin@example.com",bcrypthashing("admin123456").toString('hex')])
                db.run(insert, ["user","user@example.com",bcrypthashing("user123456").toString('hex')])
            }
        });  
    }
});


module.exports = db
