import { Ovockia } from '../../../Structures/Ovockia.mjs';
import { Undy } from '../../../Structures/Undy.mjs';
import { Jack } from '../../../Structures/Jack.mjs';
import { Stylus } from '../../../Structures/Stylus.mjs';
import { Jazmyn } from '../../../Structures/Jazmyn.mjs';

const BOLO = Ovockia;
const caseIdentity = new Jack();

export const data = { identity: 'ban-bolo' };
export async function Execute({ interaction, settings }) {

    const suspect = interaction.fields.getTextInputValue('suspect');
    const charges = interaction.fields.getTextInputValue('charges');

    if (!await Stylus.check(interaction))
        return await interaction.reply({ 
            content: await Stylus.message(), 
            ephemeral: settings.ephemeral 
        });

    await interaction.reply({
        embeds: [
            {
                color: settings.color,
                title: `Apply Ban BOLO`,
                author: { name: interaction.user.tag, icon_url: interaction.user.displayAvatarURL() },
                decription: `Slect the platforms you want the BOLO applied to. We require a platform applied to proform the next step.\n\u200b`,
                thumbnail: { url: interaction.guild.iconURL() },
                fields: [
                    { 
                        name: `<:Roblox:1058211621987680286> Roblox BOLO`, 
                        value: `If you select this option, the bot automatically bans anyone with "${suspect}" set as their Roblox username.\n\u200b` 
                    },
                    { 
                        name: `<:Discord:1058217026579087461> Discord BOLO`, 
                        value: `If you select this option, the bot automatically bans anyone with "${suspect}" set as their Discord username.` 
                    }
                ],
                footer: { text: `\u200b` }
            }
        ],
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 3,
                        custom_id: 'ban-bolo-platforms',
                        placeholder: 'No platform selected.',
                        options: [
                            { 
                                label: 'Roblox BOLO', 
                                description: `Automatically bans anyone with "${suspect}" as their Roblox username.`, 
                                emoji: '1058211608695951440', 
                                value: 'Roblox', 
                            },
                            { 
                                label: 'Discord BOLO',
                                description: `Automatically bans anyone with "${suspect}" as their Discord username or Discord Identity.`, 
                                emoji: '1058212082736185374', 
                                value: 'Discord', 
                            }
                        ]
                    }
                ]
            }
        ],
        ephemeral: settings.ephermeral
    });

    const collector = interaction.channel.createMessageComponentCollector({ 
        filter: i => i.customId === 'ban-bolo-platforms', 
        componentType: 3, 
        max: 1, 
        time: 60000 
    });

    collector.on('collect', async (i) => {

        caseIdentity.set(interaction.user.id, Date.now());

        if (i.user.id === interaction.user.id) {

            await BOLO.addBan({
                method: Jazmyn.DiscordJSInteraction,
                interaction: i,
                caseIdentity: caseIdentity.get(interaction.user.id),
                suspect: suspect,
                charges: charges
            });

            await Undy.Post({
                method: Jazmyn.DiscordJSInteraction,
                channel: settings.channels.utility.bolos.bans,
                interaction: interaction,
                data: {
                    username: `Ban BOLO`,
                    embeds: [
                        {
                            color: settings.color,
                            title: `Active Ban BOLO`,
                            author: { name: i.user.tag, iconURL: i.user.displayAvatarURL() },
                            description: `Be on the lookout for a suspect with the username "${suspect}" This BOLO's identity is ${caseIdentity.get(interaction.user.id)}. If this is a mistake, contact your administrator.\n\u200b`,
                            fields: [
                                { 
                                    name: `<:Suspect:1058559451763855390> Suspect's Charges`, 
                                    value: `${charges}.\n\u200b` 
                                },
                                { 
                                    name: `<:Roblox:1058211621987680286> Roblox Actions (B.E.T.A.)`, 
                                    value: `${i.client.user.username} will ${i.values.includes('Roblox') ? '' : 'not'} automatically ban anyone with "${suspect}" set as their Roblox username.\n\u200b` 
                                },
                                { 
                                    name: `<:Discord:1058217026579087461> Discord Actions`, 
                                    value: `${i.client.user.username} will ${i.values.includes('Discord') ? '' : 'not'} automatically ban anyone with "${suspect}" set as their Discord username.\n\u200b` 
                                }
                            ],
                            footer: { text: `\u200b` }
                        }
                    ],
                    ephemeral: settings.ephermeral
                }
            });

            setImmediate(async () => {
                await i.update({
                    embeds: [
                        {
                            color: settings.color,
                            title: `Active Ban BOLO`,
                            author: { name: i.user.tag, iconURL: i.user.displayAvatarURL() },
                            description: `Be on the lookout for a suspect with the username "${suspect}" This BOLO's identity is ${caseIdentity.get(interaction.user.id)}. If this is a mistake, contact your administrator.\n\u200b`,
                            fields: [
                                { 
                                    name: `<:Suspect:1058559451763855390> Suspect's Charges`, 
                                    value: `${charges}.\n\u200b` 
                                },
                                {
                                    name: `<:Roblox:1058211621987680286> Roblox Actions (B.E.T.A.)`, 
                                    value: `${i.client.user.username} will ${i.values.includes('Roblox') ? '' : 'not'} automatically ban anyone with "${suspect}" set as their Roblox username.\n\u200b` 
                                },
                                {
                                    name: `<:Discord:1058217026579087461> Discord Actions`, 
                                    value: `${i.client.user.username} will ${i.values.includes('Discord') ? '' : 'not'} automatically ban anyone with "${suspect}" set as their Discord username.\n\u200b` 
                                }
                            ],
                            footer: { text: `\u200b` }
                        }
                    ],
                    ephemeral: settings.ephermeral
                });
            });
        } 
        
        else {
            await i.update({
                content: Stylus.message(),
                ephemeral: true
            });
        };
    });

    collector.on('end', async i => {
        if (i.size === 0) {
            return await interaction.editReply({
                content: `Interaction expired after 60 seconds.`,
                files: [],
                embeds: [],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: 'Restart Interaction',
                                style: 2,
                                custom_id: 'restart-ban-bolo'
                            }
                        ]
                    }
                ],
                ephemeral: settings.ephermeral
            });
        };
    });
}