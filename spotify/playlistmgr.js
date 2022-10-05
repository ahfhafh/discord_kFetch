const API = require('./api');
const Database = require('../db/database');

class PlaylistManager {
	constructor() {
		this.db = new Database();
	}

	static async jsonify(res) {
		return res.json();
	}

	static extractID(url) {
		const reg = new RegExp('(?<=(track|album)/)([^?]*)', 'gm');

		return url.match(reg).pop();
	}

	async getSongsFromURL(url) {
		return [`spotify:track:${PlaylistManager.extractID(url)}`];
	}

	// add items to playlist
	async addToCurrent(url) {
		const current = await this.db.getCurrent();
		const songs = await this.getSongsFromURL(url);
		const endpoint = 'playlists/4oHPOKpVc7xBHj3N2feyRF/tracks';
		const body = {
			uris: songs,
		};

		const snapshot = await API.post(
			endpoint,
			current.access_token,
			body,
		);

		return snapshot;
	}

	async getSongFromName(name) {
		const current = await this.db.getCurrent();
		const params = {
			q: name,
			type: 'track',
			limit: 1,
		};
		const endpoint = 'search';

		const snapshot = await API.get(endpoint, params, current.access_token);

		return snapshot.data.tracks.items[0].external_urls.spotify;
	}
}

module.exports = PlaylistManager;
