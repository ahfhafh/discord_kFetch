const PlaylistManager = require('../spotify/playlistmgr');

const addSong = async function addSongToPlaylist(name) {
	const playlists = new PlaylistManager();
	const url = await playlists.getSongFromName(name);
	return await playlists.addToCurrent(url);
};

module.exports = {
	name: 'messageUpdate',
	async execute(_, message) {
		// message from kpmq bot and is embed
		if (message.author.id === '508759831755096074' && message.embeds) {
			const embed = message.embeds[0];
			// message is song result
			if (embed.description && embed.title.indexOf('wins!') === -1) {
				const song_name = embed.title.replace(/["]+/g, '').slice(0, -7);
				const songAdded = await addSong(song_name);
				if (songAdded.error) {
					const msg = songAdded.error.message || songAdded.error;

					return message.channel.send('Error (' + song_name + '): ' + msg);
				}
			}
		}
	},
};