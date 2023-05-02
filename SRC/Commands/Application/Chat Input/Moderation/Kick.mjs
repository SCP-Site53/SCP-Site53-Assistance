import { Stryder } from '../../../../Structures/Stryder.mjs';
import { Jack } from '../../../../Structures/Jack.mjs';
import { Stylus } from '../../../../Structures/Stylus.mjs';

export const data = {
    type: 1,
    name: 'kick',
    description: 'Kick (remove) a member from the server.',
    options: [
        { type: 6, name: 'member', description: 'Select the member you want to kick.', required: true },
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
    const reason = interaction.options.getString('reason');
    const note = interaction.options.getString('reason');

    caseIdentity.set(interaction.user.id, Date.now());

    if (!member) {
        return interaction.reply({ 
            content: `${member} is already kicked. You're wasting my time.`, 
            ephemeral: settings.ephemeral 
        });
    }
    else if (member.id === interaction.user.id) {
        return interaction.reply({ 
            content: `Why do you want to kick yourself? That is stupid!`, 
            ephemeral: settings.ephemeral 
        });
    }
    else if (interaction.user.id != interaction.guild.ownerId && member.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.reply({ 
            content: `Did you acutally think we would allow you to kick someone above you such as ${member}?`, 
            ephemeral: settings.ephemeral 
        });
    };

    await interaction.reply({
        embeds: [
            {
                color: settings.color,
                title: `The Boot Has Spoken!`,
                author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                description: `The Boot kicked ${member}.`,
                thumbnail: { url: interaction.guild.iconURL() },
                fields: [
                    { name: `<:Note:1058571206380507146> Note`, value: `${note ?? `No note written.`}.\n\u200b` },
                    { name: `<:Reason:1058559451763855390> Reason`, value: `${reason ?? `No reason specified.`}\n\u200b` },
                    { name: `<:Case:1073069924794241084> Case`, value: caseIdentity.get(interaction.user.id) }
                ],
                footer: { text: `\u200b` }
            }
        ],
        ephemeral: settings.ephemeral
    });
    try {

        const invite = await interaction.channel.createInvite({ maxAge: 0, maxUses: 0 });

        member.send({
            embeds: [
                {
                    color: settings.color,
                    title: `The Boot Has Spoken!`,
                    author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                    description: `The Boot kicked you from ${interaction.guild.name}.`,
                    thumbnail: { url: interaction.guild.iconURL() },
                    fields: [
                        { name: `<:Note:1058571206380507146> Note`, value: `${note ?? `No note written.`}.\n\u200b` },
                        { name: `<:Reason:1058559451763855390> Reason`, value: `${reason ?? `No reason specified.`}\n\u200b` },
                        { name: `<:Case:1073069924794241084> Case`, value: caseIdentity.get(interaction.user.id) }
                    ],
                    footer: { text: `\u200b` }
                }
            ],
            components: [
                {
                    type: 1,
                    components: (
                        {
                            type: 2,
                            label: 'Appeal',
                            url: settings.links.appeals.kicks,
                            emoji: { name: 'Appeal', id: '1058890872940417044' },
                            style: 5
                        },
                        {
                            type: 2,
                            label: 'Join Back',
                            url: invite,
                            style: 5
                        }
                    )
                }
            ]
        });

        setImmediate(async () => {
            await Stryder.kick({ 
                module: interaction, 
                caseIdentity: caseIdentity.get(interaction.user.id) 
            });
            caseIdentity.delete(interaction.user.id);
        });

    } catch (error) {
        //Error 50007 occurs when you cannot send a message to a user.
        if (error.code === 50007) {
            await Stryder.kick({ 
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