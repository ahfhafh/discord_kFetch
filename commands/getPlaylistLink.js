const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getplaylist')
		.setDescription('Give playlist link'),
	async execute(interaction) {
		await interaction.reply('https://open.spotify.com/playlist/4oHPOKpVc7xBHj3N2feyRF?si=4770fd3d28334089');
	},
};