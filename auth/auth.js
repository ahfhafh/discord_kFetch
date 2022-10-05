/* eslint-disable no-console */
/* eslint-disable no-plusplus */
// eslint-disable-next-line no-unused-vars
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const API = require('../spotify/api');
const { URLSearchParams } = require('url');
const Database = require('../db/database');

const app = express();
const db = new Database();

const authFlow = function authorizationFlow(code, res) {
	API.authorize(code).then((response) => {
		API.get('me', {}, response.data.access_token).then(async (user) => {
			await db.setUser(user.data.display_name);
			await db.setAccess(response.data.access_token);
			await db.setRefresh(response.data.refresh_token);

			res.send('OKK');
		});
	});
};

app.use(express.static(`${__dirname}/public`)).use(cors());


app.get('/login', (_, res) => {
	const state = process.env.SPOTIFY_STATE;
	res.cookie('spotify_auth_state', state);

	const query = {
		response_type: 'code',
		scope:
			'playlist-modify-public playlist-modify-private',
		client_id: process.env.SPOTIFY_CLIENT_ID,
		redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
		state: state,
	};

	res.redirect(
		`https://accounts.spotify.com/authorize?${new URLSearchParams(query).toString()}`,
	);
});

app.get('/callback', (req, res) => {
	const code = req.query.code || null;
	const state = req.query.state || null;

	if (state === null || state !== process.env.SPOTIFY_STATE) {
		res.redirect(`/#${new URLSearchParams({ error: 'state_mismatch' }).toString()}`);
	} else {
		authFlow(code, res);
	}
});

app.listen(3000, () => {
	console.log('Listening on http://localhost:3000');
});
