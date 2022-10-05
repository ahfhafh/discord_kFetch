const API = require('./api');
const Database = require('../db/database');

const db = new Database();

module.exports = {
	// eslint-disable-next-line space-before-function-paren
	refreshToken: async function () {
		const current = await db.getCurrent();
		const token = current.refresh_token;

		const res = await API.refresh(token);
		await db.setAccess(res.data.access_token);
	},
};
