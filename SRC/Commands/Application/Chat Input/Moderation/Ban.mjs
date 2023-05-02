import { Stryder } from '../../../../Structures/Stryder.mjs';
import { Jack } from '../../../../Structures/Jack.mjs';
import { Stylus } from '../../../../Structures/Stylus.mjs';
import { Norman } from '../../../../Structures/Norman.mjs';

export const data = {
    type: 1,
    name: 'ban',
    description: 'Ban a user.',
    options: [
        { type: 6, name: 'user', description: 'Select the user you want to ban.', required: true },
        { type: 3, name: 'reason', description: 'Specify a reason.' },
        { type: 3, name: 'note', description: 'Write a note.' },
        { type: 4, name: 'days', description: 'Specify the number of days you want this user banned.' }
    ]
};
export async function Execute({ interaction, settings }) {
    if (!await Stylus.check(interaction)) {
        return await interaction.reply({ 
            content: await Stylus.fetchQuote(), 
            ephemeral: settings.ephemeral 
        });
    };

    const caseIdentity = new Jack();
    const user = interaction.options.getUser('user');
    const member = interaction.options.getMember('user');
    const days = interaction.options.getNumber('days');
    const reason = interaction.options.getString('reason');
    const note = interaction.options.getString('note');

    caseIdentity.set(interaction.user.id, Date.now());

    if (member) {
        if (member.id === interaction.user.id) {
            return await interaction.reply({ 
                content: `Why do you want to ban yourself? That is stupid!`, 
                ephemeral: settings.ephemeral 
            });
        }
        else if (interaction.user.id != interaction.guild.ownerId && member.roles.highest.position >= interaction.member.roles.highest.position) {
            return await interaction.reply({ 
                content: `Sorry, I cannot ban ${user} because they are a higher rank than you.`, 
                ephemeral: settings.ephemeral 
            });
        };
    };

    await interaction.reply({
        embeds: [
            {
                color: settings.color,
                title: `The Ban Hammer Has Spoken!`,
                author: { name: user.tag, iconURL: user.displayAvatarURL() },
                description: `The Ban Hammer banned ${user}.`,
                thumbnail: { url: interaction.guild.iconURL() },
                fields: [
                    { name: `<:Note:1058571206380507146> Note`, value: `${note ?? 'No note written.'}.\n\u200b` },
                    { name: `<:Expires:1058571172406644766> Ban Expires`, value: `${Norman.toDiscord({ milliseconds: days * 86400000, style: 'R' })}.\n\u200b` },
                    { name: `<:Reason:1058559451763855390> Reason`, value: `${reason ?? 'No reason specified.'}\n\u200b` },
                    { name: `<:Case:1073069924794241084>`, value: caseIdentity.get(interaction.user.id) }
                ],
                footer: { text: `\u200b` }
            }
        ],
        ephemeral: settings.ephemeral
    });

    try {
        if (member) {
            if (!member.bot) {
                user.send({
                    embeds: [
                        {
                            color: settings.color,
                            title: `The Ban Hammer Has Spoken!`,
                            author: { name: user.tag, iconURL: user.displayAvatarURL() },
                            description: `The Ban Hammer banned you from ${interaction.guild.name}.`,
                            thumbnail: { url: interaction.guild.iconURL() },
                            fields: [
                                { name: `<:Note:1058571206380507146> Note`, value: `${note ?? 'No note written.'}.\n\u200b` },
                                { name: `<:Expires:1058571172406644766> Ban Expires`, value: `${Norman.toDiscord({ milliseconds: days * 86400000, style: 'R' })}.\n\u200b` },
                                { name: `<:Reason:1058559451763855390> Reason`, value: `${reason ?? 'No reason specified.'}\n\u200b` },
                                { name: `<:Case:1073069924794241084>`, value: caseIdentity.get(interaction.user.id) }
                            ],
                            footer: { text: `\u200b` }
                        }
                    ],
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    label: 'Appeal',
                                    url: settings.links.appeals.bans,
                                    emoji: { name: 'Appeal', id: 1058890872940417044n },
                                    style: 5
                                }
                            ]
                        }
                    ]
                });
            };
        };

        setImmediate(async () => {
            await Stryder.ban({ 
                module: interaction, 
                caseIdentity: caseIdentity.get(interaction.user.id) 
            });
            caseIdentity.delete(interaction.user.id);
        });
        
    } catch (error) {
        if (error.code === 50007) {
            await Stryder.ban({ 
                module: interaction, 
                caseIdentity: caseIdentity.get(interaction.user.id) 
            });
            caseIdentity.delete(interaction.user.id);
        }
        else {
            caseIdentity.delete(interaction.user.id);
            throw error;
        };
    };
}