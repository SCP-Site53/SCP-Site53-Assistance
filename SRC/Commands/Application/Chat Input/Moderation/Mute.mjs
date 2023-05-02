import { Stryder } from '../../../../Structures/Stryder.mjs';
import { Jack } from '../../../../Structures/Jack.mjs';
import { Stylus } from '../../../../Structures/Stylus.mjs';

export const data = {
    type: 1,
    name: 'mute',
    description: 'Mute a member (extends the timeout command).',
    options: [
        { type: 6, name: 'member', description: 'Select the member you want to mute.', required: true },
        { type: 4, name: 'minutes', description: 'Enter the number of minutes for this mute.', required: true },
        { type: 3, name: 'reason', description: 'Specify a reason.' },
        { type: 3, name: 'note', description: 'Write a note.' }
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
    const member = interaction.options.getMember('member');
    const minutes = interaction.options.getInteger('minutes');
    const reason = interaction.options.getString('reason');
    const expires = `<t:${Math.floor([Date.now() + (minutes * 86400000)] / 1000)}:f>`;
    const note = interaction.options.getString('note');

    caseIdentity.set(interaction.user.id, Date.now());

    if (!member) {
        return await interaction.reply({ 
            content: `The user you selected to mute is not in the server.`, 
            ephemeral: settings.ephemeral 
        });
    }
    else if (member.id === interaction.user.id) {
        return await interaction.reply({ 
            content: `Why do you want to mute yourself? That is stupid!`, 
            ephemeral: settings.ephemeral 
        });
    }
    else if (interaction.user.id != interaction.guild.ownerId && member.roles.highest.position >= interaction.member.roles.highest.position) {
        return await interaction.reply({ 
            content: `I cannot mute ${member} because they are a higher rank than you.`, 
            ephemeral: settings.ephemeral 
        });
    }
    else if (member.permissions.has('ADMINISTRATOR')) {
        return await interaction.reply({ 
            content: `I cannot mute ${member} because he/she has administrator permissions.`, 
            ephemeral: settings.ephemeral 
        });
    }
    else if (minutes < 1 || minutes > 10080) {
        return await interaction.reply({ 
            content: `Mute must be between 1 minute and 7 days (10080 minutes).`, 
            ephemeral: settings.ephemeral 
        });
    };

    await interaction.reply({
        embeds: [
            {
                color: settings.color,
                title: `The Boot Has Spoken`,
                author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                description: `The Boot muted ${member}.`,
                thumbnail: { url: interaction.guild.iconURL() },
                fields: [
                    { name: `<:Note:1058571206380507146> Note`, value: `${note ?? `No note written.`}.\n\u200b` },
                    { name: `<:Expires:1058571172406644766> Mute Expires`, value: `${expires}.\n\u200b` },
                    { name: `<:Reason:1058559451763855390> Reason`, value: `${reason ?? `No reason specified.`}` },
                    { name: `<:Case:1073069924794241084>`, value: caseIdentity.get(interaction.user.id) }
                ],
                footer: { text: `\u200b` }
            }
        ],
        ephemeral: settings.ephemeral,
    });

    setImmediate(async () => {
        try {
            member.send({
                embeds: [
                    {
                        color: settings.color,
                        title: `The Boot Has Spoken!`,
                        author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                        description: `The Boot muted you at ${interaction.guild.name}.`,
                        thumbnail: { url: interaction.guild.iconURL() },
                        fields: [
                            { name: `<:Note:1058571206380507146> Note`, value: `${note ?? `No note written.`}.\n\u200b` },
                            { name: `<:Expires:1058571172406644766> Mute Expires`, value: `${expires}.\n\u200b` },
                            { name: `<:Reason:1058559451763855390> Reason`, value: `${reason ?? `No reason specified.`}` },
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
                                url: settings.links.appeals.timeouts_and_mutes,
                                emoji: { name: 'Appeal', id: '1058890872940417044' },
                                style: 5
                            }
                        ]
                    }
                ]
            });

            setImmediate(async () => {
                await Stryder.mute({ 
                    module: interaction, 
                    caseIdentity: caseIdentity.get(interaction.user.id) 
                });
                caseIdentity.delete(interaction.user.id);
            });

        } catch (error) {

            if (error.code === 50007) {
                await Stryder.mute({
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
    });
}