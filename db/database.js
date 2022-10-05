/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const sqlite3 = require('sqlite3').verbose();
const Promise = require('promise');
require('dotenv').config();

class Database {
	constructor(dbName = process.env.DATABASE) {
		this.db = new sqlite3.Database(`./db/${dbName}`, err => {
			if (err) {
				console.log(err);
			} else {
				console.log('connected to DB');
			}
		});
	}

	run(query, params = []) {
		return new Promise((resolve, reject) => {
			this.db.run(query, params, function cb(err) {
				if (err) {
					console.log(err, 'Database');
					reject(err);
				} else {
					resolve({ value: this.changes });
				}
			});
		});
	}

	get(query, params = []) {
		return new Promise((resolve, reject) => {
			this.db.get(query, params, (err, result) => {
				if (err) {
					console.log(err, 'Database');
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}

	static updateSql(col) {
		return `UPDATE current SET ${col} = ? WHERE rowid = 1`;
	}


	init() {
		return this.run(
			'CREATE TABLE IF NOT EXISTS current (user PRIMARY KEY, access_token, refresh_token)',
		);
	}

	initCurrent() {
		const user = process.env.SPOTIFY_CLIENT_ID;

		return this.run('INSERT INTO current (user) VALUES (?)', [user]);
	}

	getCurrent() {
		return this.get('SELECT * FROM current');
	}

	setUser(userId) {
		return this.run(Database.updateSql('user'), [userId]);
	}

	setRefresh(token) {
		return this.run(Database.updateSql('refresh_token'), [token]);
	}

	setAccess(token) {
		return this.run(Database.updateSql('access_token'), [token]);
	}
}

module.exports = Database;
