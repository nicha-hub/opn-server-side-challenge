const util = require('util');

const sqlite3 = require('sqlite3').verbose();

class SqlLite {
	constructor() {
		this.connect();
  	}

    initial = () => {
        this.db.serialize(async() => {
            this.db.run("DROP TABLE IF EXISTS users");
            this.db.run(`CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,     
                email TEXT NOT NULL,
                name TEXT NOT NULL,
                password varchar(255) NOT NULL,
                birthdate DATE NOT NULL,
                gender TEXT CHECK( gender IN ('male', 'female') ) NOT NULL,
                address TEXT NOT NULL,
                subscribe_newsletter TEXT CHECK( subscribe_newsletter IN ('T', 'F') ) DEFAULT 'T',
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP)`
            );
            this.db.run(`CREATE INDEX IF NOT EXISTS idx_email ON users(email)`);
            this.db.run(`CREATE INDEX IF NOT EXISTS idx_birthdate ON users(birthdate)`);
            this.db.run(`CREATE INDEX IF NOT EXISTS idx_gender ON users(gender)`);
            this.db.run(`CREATE INDEX IF NOT EXISTS idx_subscribe_newsletter ON users(subscribe_newsletter)`);

            const stmt = this.db.prepare("INSERT INTO users (email,name,password,birthdate,gender,address,subscribe_newsletter,created_date,modified_date) VALUES (?,?,?,?,?,?,?,?,?)");
            for (let i = 0; i < 2; i++) {
                let int_dt = [
                    `user_${i+1}@test.com`,
                    `user_${i+1}`,
                    `password${i+1}`,
                    `1996-05-11`,
                    `${(i+1)%2 == 0? 'male':'female'}`,
                    `address_${i+1}`,
                    `${(i+1)%2 == 0? 'T':'F'}`,
                    `2024-09-18 00:00:00`,
                    `2024-09-18 00:00:00`
                ]
                stmt.run(int_dt);
            }
            stmt.finalize();
        });
    }

    connect = () => {
        this.db = new sqlite3.Database('./my-database.db', (err) => {
            if (err) {
                console.error('Could not connect to SQLite database:', err);
            } else {
                console.log('Connected to SQLite database');
            }
        });
        this.queryDatabase = util.promisify(this.db.all).bind(this.db);
    }

    close = () => {
        this.db.close();
    }

    isConnectionClosed = async () => {
        try {
            await this.queryDatabase('SELECT 1');
            return false;
        } catch (err) {
            if (err.message.includes('SQLITE_MISUSE')) {
                return true;
            }
            throw err;
        }
    }

    query = async (sql, select_params) => {
        let result = { status: false, data: []}
        try {
            if (await this.isConnectionClosed()) {
                this.connect();
            }
            const data = await this.queryDatabase(sql, select_params);
            result.status = true;
            result.data = data;
        } catch (err) {
            result.error = err;
        }
        return result;
    }

    runDatabase = (sql, insert_params) => {
        let result = { status: false, data: []}
        return new Promise((resolve, reject) => {
            this.db.run(sql, insert_params, function(err) {
                if (err) {
                    result.error = err;
                }else {
                    result.status = true;
                    result.insert_id = this.lastID;
                }
                resolve(result);
            });
        });
    }

    execute = async (sql, insert_params) => {
        let result = { status: false, data: []}
        try {
            if (await this.isConnectionClosed()) {
                this.connect();
            }
            result = await this.runDatabase(sql,insert_params);
        } catch (err) {
            result.error = err;
        }
        return result;
    }
}

module.exports = SqlLite