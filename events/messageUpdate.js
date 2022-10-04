module.exports = {
	name: 'messageUpdate',
	execute(oldmsg, message) {
		console.log('fe');
		if (message.author.id === '508759831755096074') {
			if (message.embeds) {
				const embed = message.embeds[0];
				console.log(embed);
				if (embed.description) {
					console.log(embed);
					return message.channel.send(embed.title);
				}
			}
		}
	},
};

// client.on('messageUpdate', (_, message) => {
// 	console.log('fe');
// 	if (message.author.id === '508759831755096074') {
// 		if (message.embeds) {
// 			const embed = message.embeds[0];
// 			console.log(embed);
// 			if (embed.description) {
// 				console.log(embed);
// 				return message.channel.send(embed.title);
// 			}
// 		}
// 	}
// });