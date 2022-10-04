const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pingg')
		.setDescription('Replies with Pongg!'),
	async execute(interaction) {
		console.log('pongg!');
		await interaction.reply('Pongg!');
	},
};