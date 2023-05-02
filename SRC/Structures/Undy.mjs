import { Michael } from './Michael.mjs';
import { Justin } from './Justin.mjs';
import { Jazmyn } from './Jazmyn.mjs';
import { Blake } from './Blake.mjs';

export class Undy {
	static async post({ method = Jazmyn.DiscordAPIPost, channel = null, event = null, client = null, data = null, interaction = null }) {
		
		let bot;
		let webhooks;
		let webhook;
		let channelData;

		switch (method) {
			case Jazmyn.DiscordAPIPost:

				if (channel === null || data === null) {
					throw new Error(`Undy must have a Channel or Data argument.`);
				};

				bot = await (
					await Michael.discordRequest({ 
						endpoint: 'users/@me', 
						method: Justin.Get 
					})
				).data;
				webhooks = await (
					await Michael.discordRequest({ 
						endpoint: `/channels/${channel}/webhooks`, 
						method: Justin.Get 
					})
				).data;
				webhook = webhooks.find(wh => wh.user.id === bot.id);
				
				if (!webhook) {

					await Michael.discordRequest({
						endpoint: `/channels/${channel}/webhooks`,
						method: Justin.Post,
						data: {
							name: `SCP Site53 Assistance`,
							avatar: Blake.resolveImage(`https://cdn.discordapp.com/avatars/1048011737296805909/eefb7e16db571e10fef5839a4b258c7c.png?size=4096`)
						}
					}).then(async webhook => {
						await Michael.discordRequest({ 
							endpoint: `/webhooks/${webhook.id}/${webhook.token}`, 
							method: Justin.Post, 
							data: data 
						});
					});

				} else {
					
					await Michael.discordRequest({ 
						endpoint: `/webhooks/${webhook.id}/${webhook.token}`, 
						method: Justin.Post, 
						data: data 
					});
				};

				break;

			case Jazmyn.DiscordJSClient:

				channelData = client.channels.cache.get(channel);
				webhooks = await channelData.fetchWebhooks();
				webhook = webhooks.find(wh => wh.owner.id === client.user.id);

				if (!webhook) {
					channelData.createWebhook({
						name: client.user.username,
						avatar: client.user.displayAvatarURL({ dynamic: true, size: 4096 }),
						reason: `An server administrator executed our client and it cannot function without a webhook.`
					}).then(webhook => {
						webhook.send(data);
					});
				} else {
					webhook.send(data);
				};

				break;

			case Jazmyn.DiscordJSEvent:

				if (!event){
					if (interaction){
						event = interaction;
					};
				};

				channelData = event.client.channels.cache.get(channel);
				webhooks = await channelData.fetchWebhooks();
				webhook = webhooks.find(wh => wh.owner.id === event.client.user.id);

				if (!webhook) {
					channelData.createWebhook({
						name: event.client.user.username,
						avatar: event.guild.iconURL({ dynamic: true, size: 4096 }),
						reason: `${event.user.tag} (${event.user.id}) executed ${event} and it cannot function without a webhook.`
					})
					.then(webhook => {
						webhook.send(data);
					});
					
				} else {
					webhook.send(data);
				};

				break;

			default:
				throw new Error('Undy recieved an invalid method argument.');
		};
	};
	/**
	 * Use `Undy.post()`
	 * @deprecated
	 */
	static async Post({ method = null, channel = null, interaction = null, client = null, data = null }) {
		return this.post({ method, channel, interaction, client, data });
	};
}