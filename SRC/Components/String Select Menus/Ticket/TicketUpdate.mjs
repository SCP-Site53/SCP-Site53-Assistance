import { Stylus } from '../../../Structures/Stylus.mjs';

export const data = { identity: 'ticket-update', };
export async function Execute({ interaction, settings }) {
    if (interaction.values[0] === 'close') {
        if (!await Stylus.check(interaction))
            return await interaction.reply({ 
                content: await Stylus.message(), 
                ephemeral: settings.ephemeral 
            });
        await interaction.showModal({
            title: 'Close Support Ticket',
            custom_id: 'ticket-delete',
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: 'reason',
                            label: 'What is the reason to close this ticket?',
                            style: 2,
                            min_length: 1,
                            max_length: 1000,
                            placeholder: 'No reason specified.',
                            required: false
                        }
                    ]
                }
            ]
        });
    }
    else if (interaction.values[0] == 'transcript') {
        const messages = await interaction.channel.messages.fetch();
        await interaction.reply({
            embeds: [
                {
                    color: settings.color,
                    titile: `Ticket Transcript`,
                    author: { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() },
                    description: `Here is your transcript. Let us know if you need anything else.\n\u200b`,
                    thumbnail: { url: interaction.guild.iconURL() },
                    timestamp: new Date().toISOString(),
                    footer: settings.footer
                }
            ],
            files: [
                {
                    data: { name: `transcript-${interaction.channel.name}.txt` },
                    attachment: Buffer.from(`Transcript for ${interaction.channel.name} (${interaction.channelId})\n\n ${messages.map(m => `[${m.createdAt.toLocaleDateString()} ${m.createdAt.toLocaleTimeString()}] ${m.author.tag}: ${m.content}`).join('\n')}`)
                }
            ],
            ephemeral: settings.ephermeral
        });
    };
}