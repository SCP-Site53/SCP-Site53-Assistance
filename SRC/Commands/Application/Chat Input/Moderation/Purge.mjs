import { Jack } from '../../../../Structures/Jack.mjs';
import { Stylus } from '../../../../Structures/Stylus.mjs';

export const data = {
    type: 1,
    name: 'purge',
    description: 'Delete a group of messages.',
    options: [
        {
            type: 1,
            name: 'any',
            description: 'Deletes any messages.',
            options: [
                { type: 4, name: 'amount', description: 'The amount of messages you want deleted.', required: true },
                { type: 7, name: 'channel', description: 'An alternative channel to purge.' },
                { type: 3, name: 'reason', description: 'Specify a reason.' },
                { type: 3, name: 'note', description: 'Write a note.' }
            ]
        },
        {
            type: 2,
            name: 'from',
            description: 'Purges from something.',
            options: [
                {
                    type: 1,
                    name: 'target',
                    description: 'Deletes messages from a target.',
                    options: [
                        { type: 4, name: 'amount', description: 'The amount of messages you want deleted.', required: true },
                        { type: 6, name: 'target', description: 'The target.', required: true },
                        { type: 7, name: 'channel', description: 'An alternative channel to purge.' },
                        { type: 3, name: 'reason', description: 'Specify a reason.' },
                        { type: 3, name: 'note', description: 'Write a note.' }
                    ]
                },
                {
                    type: 1,
                    name: 'users',
                    description: 'Deletes messages from users.',
                    options: [
                        { type: 4, name: 'amount', description: 'The amount of messages you want deleted.', required: true },
                        { type: 7, name: 'channel', description: 'An alternative channel to purge.' },
                        { type: 3, name: 'reason', description: 'Specify a reason.' },
                        { type: 3, name: 'note', description: 'Write a note.' }
                    ]
                },
                {
                    type: 1,
                    name: 'bots',
                    description: 'Deletes messages from bots.',
                    options: [
                        { type: 4, name: 'amount', description: 'The amount of messages you want deleted.', required: true },
                        { type: 7, name: 'channel', description: 'An alternative channel to purge.' },
                        { type: 3, name: 'reason', description: 'Specify a reason.' },
                        { type: 3, name: 'note', description: 'Write a note.' }
                    ]
                },
                {
                    type: 1,
                    name: 'webhooks',
                    description: 'Deletes messages from webhooks.',
                    options: [
                        { type: 4, name: 'amount', description: 'The amount of messages you want deleted.', required: true },
                        { type: 7, name: 'channel', description: 'An alternative channel to purge.' },
                        { type: 3, name: 'reason', description: 'Specify a reason.' },
                        { type: 3, name: 'note', description: 'Write a note.' }
                    ]
                }
            ]
        },
        {
            type: 2,
            name: 'containing',
            description: 'Purges messages contianing something.',
            options: [
                {
                    type: 1,
                    name: 'links',
                    description: 'Deletes messages containing links.',
                    options: [
                        { type: 4, name: 'amount', description: 'The amount of messages you want deleted.', required: true },
                        { type: 7, name: 'channel', description: 'An alternative channel to purge.' },
                        { type: 3, name: 'reason', description: 'Specify a reason.' },
                        { type: 3, name: 'note', description: 'Write a note.' }
                    ]
                },
                {
                    type: 1,
                    name: 'attachments',
                    description: 'Deletes messages containing attachments.',
                    options: [
                        { type: 4, name: 'amount', description: 'The amount of messages you want deleted.', required: true },
                        { type: 7, name: 'channel', description: 'An alternative channel to purge.' },
                        { type: 3, name: 'reason', description: 'Specify a reason.' },
                        { type: 3, name: 'note', description: 'Write a note.' }
                    ]
                },
                {
                    type: 1,
                    name: 'argument',
                    description: 'Deletes messages containing an argument.',
                    options: [
                        { type: 4, name: 'amount', description: 'The amount of messages you want deleted.', required: true },
                        { type: 3, name: 'argument', description: 'The argument.', required: true },
                        { type: 7, name: 'channel', description: 'An alternative channel to purge.' },
                        { type: 3, name: 'reason', description: 'Specify a reason.' },
                        { type: 3, name: 'note', description: 'Write a note.' }
                    ]
                }
            ]
        }
    ]
};

export async function Execute({ interaction, settings }) {
    if (!Stylus.check(interaction)) {
        return interaction.reply({ 
            content: Stylus.fetchQuote(), 
            ephemeral: settings.ephemeral 
        });
    };
    
    const amount = interaction.options.getInteger('amount');
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;
    const target = interaction.options.getUser('target');
    const argument = interaction.options.getString('argument');
    const messages = await channel.messages.fetch({ limit: amount, cache: false, force: true });
    const messagesToDelete = new Jack();

    let embed = {
        color: settings.color,
        author: { name: interaction.user.tag, icon_url: interaction.user.displayAvatarURL() },
        timeout: new Date().toISOString(),
        footer: settings.footer
    };

    for (const message of messages.values()) {
        
        if (toDelete.size >= amount)
            break;

        if (!message.deletable)
            continue;

        if (message.createdTimestamp < Date.now() - 1209600000) {
            embed.fields = embed.fields = [{ name: `Error Message`, value: `I cannot purge messages over 14 days old.` }];
            continue;
        };
        switch (interaction.options.getSubcommand()) {
            case 'any':
                    messagesToDelete.set(message.id, message);
                break;
            case 'target':
                if (message.author.id === target.id)
                    messagesToDelete.set(message.id, message);
                break;
            case 'users':
                if (!message.author.bot)
                    messagesToDelete.set(message.id, message);
                break;
            case 'bots':
                if (message.author.bot)
                    messagesToDelete.set(message.id, message);
                break;
            case 'webhooks':
                if (message.author.webhook)
                    messagesToDelete.set(message.id, message);
                break;
            case 'links':
                if (/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(message.content))
                    messagesToDelete.set(message.id, message);
                break;
            case 'attachments':
                if (message.attachments.size > 0)
                    messagesToDelete.set(message.id, message);
                break;
            case 'argument':
                if (message.content.includes(argument))
                    messagesToDelete.set(message.id, message);
                break;
        };
    };

    if (toDelete.size === 0 ){
        if (!embed.fields) {
            embed.fields = [
                { 
                    name: `Error Message`, 
                    value: `I could not find any messages that fitted what you requested.` 
                }
            ];
        };
    };
    await channel.bulkDelete(messagesToDelete, true).then(async deletedMessages => {

        if (deletedMessages < amount) {
            if (!embed.fields){
                embed.fields = [
                    { 
                        name: `Error Message`, 
                        value: `I could not find ${amount - deletedMessages} of the messages that you requested purged.` 
                    }
                ];
            };
        };

        embed.description = `I just purged ${deletedMessages.size === amount ? deletedMessages.size : `${deletedMessages.size}/${amount}`} messages.`;

        await interaction.reply({ 
            embeds: [embed], 
            ephemeral: settings.ephemeral 
        });
    });
};