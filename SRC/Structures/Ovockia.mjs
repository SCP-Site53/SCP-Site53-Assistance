import { Oliver } from './Oliver';
import { Jazmyn } from './Jazmyn.mjs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, RESTJSONErrorCodes } = require('discord.js');

export class Ovockia {
    static async addBan({ method, interaction, caseIdentity, suspect, charges }) {
        switch (method) {
            case Jazmyn.DiscordJSEvent:
                const database = new Oliver({ guild: interaction.guild.id });
                const settings = database.get('settings');
                const identity = caseIdentity;
                await database.set(`bolos.identities.${identity}`, {
                    type: `Ban`,
                    suspect: suspect,
                    charges: charges,
                    issuer: interaction.user.id,
                    roblox: interaction.values.includes('Roblox'),
                    discord: interaction.values.includes('Discord')
                });
                await database.push(`bolos.suspects.${suspect}`, identity);
                if (interaction.values.includes('Discord')) {
                    setImmediate(async () => {
                        interaction.guild.members.fetch().then(fetchedMembers => {
                            const suspects = fetchedMembers.filter(member => member.username === suspect);
                            if (suspects) {
                                for (const suspect of suspects) {
                                    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                                        if (interaction.member.roles.cache.some(role => [
                                            ...settings.roles.staff.ranks.moderator,
                                            ...settings.roles.staff.ranks.administrator,
                                            ...settings.roles.staff.ranks.internal_affairs,
                                            ...settings.roles.staff.ranks.management,
                                            ...settings.roles.staff.ranks.executive
                                        ]
                                            .includes(role.id)
                                        )) {
                                            return async () => {
                                                await database.delete(`bolos.suspects.${suspect}`);
                                                await database.delete(`bolos.identities.${identity}`);
                                            };
                                        };
                                    } else {
                                        suspect.send({
                                            embeds: [
                                                new EmbedBuilder()
                                                    .setColor(settings.color)
                                                    .setAuthor({ name: suspect.tag, iconURL: suspect.displayAvatarURL() })
                                                    .setTitle(`The Ban Hammer Has Spoken!`)
                                                    .setDescription(`You are banned from ${interaction.guild.name}.`)
                                                    .setThumbnail(interaction.guild.iconURL())
                                                    .addFields(
                                                        { name: `<:Note:1058571206380507146> Ban Note`, value: `You are banned because of active ban BOLO ${identity}.\n\u200b` },
                                                        { name: `<:Expires:1058571172406644766> Ban Expires`, value: `Ban BOLOs never expire. To remove you ban, contant a server administrator.\n\u200b` },
                                                        { name: `<:Reason:1058559451763855390> Reason`, value: `${offenses}` }
                                                    )
                                                    .setFooter({ text: `\u200b` })
                                            ],
                                            components: [
                                                new ActionRowBuilder()
                                                    .addComponents(
                                                        new ButtonBuilder()
                                                            .setLabel('Appeal')
                                                            .setURL(settings.links.appeals.bans)
                                                            .setStyle(ButtonStyle.Link)
                                                    )
                                            ]
                                        }).catch((error) => {
                                            if (error.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser) {
                                                interaction.guild.members.ban(suspect.id, {
                                                    reason: [`
                                                        Issuer: Ovockia via ban BOLO ${identity},
                                                        Expires: Never,
                                                        Reason: ${charges}
                                                        `]
                                                });
                                            } else {
                                                throw error;
                                            };
                                        });
                                        setImmediate(() => {
                                            interaction.guild.members.ban(suspect.id, {
                                                reason: [`
                                                    Issuer: Ovockia via ban BOLO ${identity},
                                                    Expires: Never,
                                                    Reason: $offensescharges}
                                                    `]
                                            });
                                        });
                                    };
                                } return async () => {
                                    await database.delete(`bolos.suspects.${suspect}`);
                                    await database.delete(`bolos.identities.${identity}`);
                                };
                            };
                        });
                    });
                };
                break;
        }
    };
}