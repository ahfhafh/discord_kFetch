const API = require('./api');
const Database = require('../db/database');

class PlaylistManager {
	constructor() {
		this.db = new Database();
	}

	static async jsonify(res) {
		return res.json();
	}

	static parse(res) {
		if (res.type === 'playlist') {
			return {
				id: res.id,
				type: res.type,
				name: res.name,
				description: res.description,
			};
		}

		return { error: res.error };
	}

	static extractID(url) {
		const reg = new RegExp('(?<=(track|album)/)([^?]*)', 'gm');

		return url.match(reg).pop();
	}

	static getSongURI(url) {
		return [`spotify:track:${PlaylistManager.extractID(url)}`];
	}

	async getSongsFromURL(url) {
		let songs;

		if (url.includes('album')) {
			songs = await this.getSongsFromAlbum(url);
		} else {
			songs = PlaylistManager.getSongURI(url);
		}

		return songs;
	}

	// get playlist
	async updateCurrent(details) {
		const current = await this.db.getCurrent();
		const status = await API.put(
			'playlists/4oHPOKpVc7xBHj3N2feyRF',
			current.access_token,
			details,
			(res) => res.status,
		);

		return status;
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
			PlaylistManager.jsonify,
		);

		return snapshot;
	}
}

module.exports = PlaylistManager;
