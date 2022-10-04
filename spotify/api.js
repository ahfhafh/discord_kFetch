/* eslint-disable no-param-reassign */
/* eslint-disable arrow-body-style */
// eslint-disable-next-line no-unused-vars
require('dotenv').config({ path: '../.env' });
const axios = require('axios');

class API {
	static getURI(endpoint) {
		return `https://api.spotify.com/v1/${endpoint}`;
	}

	static handleError(err) {
		console.log(err, 'API');
	}

	static encodeJson(data) {
		// eslint-disable-next-line arrow-body-style
		return Object.entries(data)
			.map((keyPair) => {
				return keyPair.map((val) => encodeURIComponent(val)).join('=');
			})
			.join('&');
	}

	static request(endpoint, opts) {
		let url;

		if (endpoint.includes('http')) {
			url = endpoint;
		} else {
			url = API.getURI(endpoint);
		}

		return axios({ url: url, ...opts }).then(resp => {
			if (resp.status === 200) {
				return resp;
			} else {
				console.log('Err: ' + resp.status);
			}
		}).catch(API.handleError);
	}

	static withForm(method) {
		return function requestWithForm({
			endpoint,
			token = null,
			body,
			json = true,
		}) {

			const opts = {
				method,
				data: json ? JSON.stringify(body) : API.encodeJson(body),
				headers: {
					'Content-Type': json
						? 'application/json'
						: 'application/x-www-form-urlencoded',
				},
			};

			if (!json) {
				opts.headers.Authorization = `Basic ${new Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`;
			}

			if (json) {
				opts.headers.Authorization = `Bearer ${token}`;
			}

			return API.request(endpoint, opts);
		};
	}

	static get(endpoint, token) {
		const opts = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		return API.request(endpoint, opts);
	}

	// { endpoint, token, body, json = true }
	static post(endpoint, token, body) {
		const postForm = API.withForm('POST');

		return postForm({
			endpoint,
			token,
			body,
		});
	}

	static put(endpoint, token, body) {
		const putForm = API.withForm('PUT');

		return putForm({
			endpoint,
			token,
			body,
		});
	}

	static authorize(code) {
		const postForm = API.withForm('POST');
		const body = {
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
		};

		return postForm({
			endpoint: 'https://accounts.spotify.com/api/token',
			body,
			json: false,
		});
	}

	static refresh(refreshToken) {
		const postForm = API.withForm('POST');
		const body = {
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
		};

		return postForm({
			endpoint: 'https://accounts.spotify.com/api/token',
			body,
			json: false,
		});
	}
}

module.exports = API;
