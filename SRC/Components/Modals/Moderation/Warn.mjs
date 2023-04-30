import { Stryder } from '../../../Structures/Stryder.mjs';
import { Jack } from '../../../Structures/Jack.mjs';
import { Stylus } from '../../../Structures/Stylus.mjs';
import { victims } from '../../../Commands/Application Commands/Context Menus/Warn.mjs';

const caseIdentity = new Jack();

export const data = { identity: 'warn' };
export async function Execute({ interaction, settings }) {
    if (!Stylus.check(interaction))
        return interaction.reply({ 
            content: Stylus.message(), 
            ephemeral: settings.ephemeral 
        });
    const member = victims.get(interaction.user.id);
    const reason = interaction.fields.getTextInputValue('reason');
    const note = interaction.fields.getTextInputValue('note');

    caseIdentity.set(interaction.user.id, Date.now());

    if (!member)
        return interaction.reply({ 
            content: `The user you selected to warn is not in the server.`, 
            ephemeral: settings.ephemeral 
        });

    else if (member.id === interaction.user.id)
        return interaction.reply({ 
            content: `Why do you want to warn yourself? That is stupid!`, 
            ephemeral: settings.ephemeral 
        });

    else if (interaction.user.id != interaction.guild.ownerId && member.roles.highest.position >= interaction.member.roles.highest.position)
        return interaction.reply({ 
            content: `I cannot warn ${member} because they are a higher rank than you.`, 
            ephemeral: settings.ephemeral 
        });

    await interaction.reply({
        embeds: [
            {
                color: settings.color,
                author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                description: `I warned ${member}.`,
                thumbnail: { url: interaction.guild.iconURL() },
                fields: [
                    { name: `<:Note:1058571206380507146> Note`, value: `${note ?? `No note written.`}\n\u200b` },
                    { name: `<:Reason:1058559451763855390> Reason`, value: `${reason ?? `No reason specified.`}\n\u200b` },
                    { name: `<:Case:1073069924794241084>`, value: caseIdentity.get(interaction.user.id) }
                ],
                footer: { text: '\u200b' }
            }
        ],
        ephemeral: settings.ephemeral
    });

    await Stryder.warn({ 
        module: interaction, 
        caseIdentity: caseIdentity.get(interaction.user.id) 
    });

    setImmediate(async () => {
        try {
            if (!member.bot) {
                member.send({
                    embeds: [
                        {
                            color: settings.color,
                            title: `The Boot Has Spoken!`,
                            author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                            description: `You were warned in ${interaction.guild.name}.`,
                            thumbnail: { url: interaction.guild.iconURL() },
                            fields: [
                                { name: `<:Note:1058571206380507146> Note`, value: `${note ?? `No note written.`}\n\u200b` },
                                { name: `<:Reason:1058559451763855390> Reason`, value: `${reason ?? `No reason specified.`}\n\u200b` },
                                { name: `<:Case:1073069924794241084>`, value: caseIdentity.get(interaction.user.id) }
                            ],
                            footer: { text: '\u200b' }
                        }
                    ],
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 3,
                                    label: 'Appeal',
                                    ur: settings.links.appeals.warn,
                                    emoji: { id: '1058890872940417044' },
                                    style: 5
                                }
                            ]
                        }
                    ]
                });
            }
        } 
        
        catch (error) {
            if (error.code === 50007)
                await Stryder.warn({ 
                    module: interaction, 
                    caseIdentity: caseIdentity.get(interaction.user.id) 
                });
            else
                throw error;
        };
    });
}