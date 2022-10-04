module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setActivity('with ur feelings', { type: 'PLAYING' });
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};