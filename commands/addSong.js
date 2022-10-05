const { SlashCommandBuilder } = require('discord.js');
const PlaylistManager = require('../spotify/playlistmgr');

const addSong = async function addSongToPlaylist(name) {
	const playlists = new PlaylistManager();
	const url = await playlists.getSongFromName(name);
	return await playlists.addToCurrent(url);
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addsong')
		.setDescription('Add a song to spotify')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('input')
				.setRequired(true)),
	async execute(interaction) {
		const song_name = interaction.options.getString('input');
		const songAdded = await addSong(song_name);
		if (songAdded.error) {
			const msg = songAdded.error.message || songAdded.error;

			await interaction.reply('Err: ' + msg);
		} else {
			await interaction.reply('Song added!');
		}
	},
};