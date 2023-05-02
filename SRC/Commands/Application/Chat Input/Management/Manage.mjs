import { Undy } from '../../../../Structures/Undy.mjs';
import { Stylus } from '../../../../Structures/Stylus.mjs';
import { Jazmyn } from '../../../../Structures/Jazmyn.mjs';
import { Seth } from '../../../../Structures/Seth.mjs';
import { Allie } from '../../../../Structures/Allie.mjs';
import ms from 'ms';

export const data = {
    type: 1,
    name: 'manage',
    description: 'Manages something.',
    options: [
        {
            type: 2,
            name: 'staff',
            description: 'Manages staff.',
            options: [
                {
                    type: 1,
                    name: 'shifts',
                    description: 'Manages yours or another staff\'s shifts',
                    options: [
                        { 
                            type: 6, 
                            name: 'member', 
                            description: 'Slect an alternatve member (replaces you for this task).' 
                        }
                    ]
                }
            ]
        },
        {
            type: 2,
            name: 'server',
            description: 'Manages a in-game server.',
            options: [
                {
                    type: 1,
                    name: 'status',
                    description: 'Manages a in-game server\'s status.',
                    options: [
                        {
                            type: 3,
                            name: 'server',
                            description: 'Which server\'s status would you like to manage?',
                            required: true,
                            choices: [
                                { name: 'Public', value: 'public' }, 
                                { name: 'Whitelisted', value: 'whitelisted' }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
export async function Execute({ interaction, database, settings }) {
    
    if (!await Stylus.check(interaction)) {
        return await interaction.reply({ 
            content: await Stylus.message(), 
            ephemeral: settings.ephemeral 
        });
    };

    if (interaction.options.getSubcommandGroup() === 'staff' && interaction.options.getSubcommand() === 'shifts') {

        let member = interaction.options.getMember('member') ?? interaction.member;

        member.shifts = {
            status: {
                onDuty: await database.get(`shifts.${member.id}.${Seth.OnDutyStatus}`),
                onBreak: await database.get(`shifts.${member.id}.${Seth.OnBreakStatus}`)
            },
            duration: {
                onDuty: await database.get(`shifts.${member.id}.${Seth.OnDutyDuration}`),
                onBreak: await database.get(`shifts.${member.id}.${Seth.OnBreakDuration}`)
            },
            total: await database.get(`shifts.${member.id}.${Seth.TotalShifts}`)
        };

        member.lines = {
            do: `do`,
            has: `have`,
            name: `You`,
            pluralTag: `your`,
            pluralUppercaseTag: `Your`,
            tag: `your`,
            is: 'are'
        };

        if (member !== interaction.member) {
            member.lines = {
                do: `does`,
                has: `has`,
                name: member,
                pluralTag: `${member}'s`,
                pluralUppercaseTag: `${member}'s`,
                tag: member,
                is: 'is'
            };
        };

        await interaction.reply({
            embeds: [
                {
                    color: settings.color,
                    title: `Manage ${member.lines.pluralUppercaseTag} Shifts`,
                    author: { name: member.user.tag, iconURL: member.displayAvatarURL() },
                    description: `🟢 Starts a shift\n🟡 Breaks or unbreaks a shift\n🔴 Ends a shift\n\u200B`,
                    thumbnail: { url: interaction.guild.iconURL() },
                    fields: [
                        {
                            name: `Shift Status`,
                            value: `
                                > On Duty: \`${member.shifts.status.onDuty ? `Yes` : `No`}\`
                                > On Break: \`${member.shifts.status.onBreak ? `Yes` : `No`}\`
                                \u200B`
                        },
                        {
                            name: `Shift Information`,
                            value: `
                                > Total Shifts: \`${member.shifts.total ? `${member.shifts.total} shifts` : `N/A (No time on duty)`}\`.
                                > Total Time On Duty: \`${member.shifts.duration.onDuty ? ms(member.shifts.duration.onDuty, { long: true }) : `N/A (No time on duty)`}\`.
                                > Total Time On Break: \`${member.shifts.duration.onBreak ? ms(member.shifts.duration.onBreak, { long: true }) : member.shifts.duration.onDuty ? '0 seconds' : `N/A (No time on duty)`}\`.
                                \u200B`
                        }
                    ]
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 3,
                            customId: 'shift',
                            placeholder: 'Click here to manage your shift.',
                            min_values: 1,
                            max_values: 1,
                            options: [
                                {
                                    label: 'Start Shift',
                                    description: `Starts ${member.lines.pluralTag} shift`,
                                    value: `start`,
                                    emoji: `🟢`
                                },
                                {
                                    label: 'Break Shift',
                                    description: `Breaks or unbreaks ${member.lines.pluralTag} shift`,
                                    value: `break`,
                                    emoji: `🟡`
                                },
                                {
                                    label: 'End Shift',
                                    description: `Ends ${member.lines.pluralTag} shift`,
                                    value: `end`,
                                    emoji: `🔴`
                                }
                            ]
                        }
                    ]
                },
            ],
            ephemeral: settings.ephemeral
        });

        const collector = interaction.channel.createMessageComponentCollector({ 
            filter: i => i.customId === 'shift', 
            componentType: 3, 
            max: 1, 
            time: 60000 
        });

        collector.on('collect', async i => {
            if (i.user.id != interaction.user.id) {
                return await i.update({ 
                    content: await Stylus.message(), 
                    embeds: [], 
                    components: [], 
                    ephemeral: true 
                });
            }

            else if (!await Stylus.check(i)) {
                return await i.update({ 
                    content: await Stylus.message(), 
                    embeds: [], 
                    components: [], 
                    ephemeral: true 
                });
            };

            if (i.values[0] === `start`) {

                if (member.shifts.status.onDuty || member.shifts.status.onBreak) {
                    return i.update({
                        embeds: [
                            {
                                color: settings.color,
                                author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                                description: `${member.lines.name} already ${member.lines.has} an active shift.`,
                                thumbnail: { url: interaction.guild.iconURL() }
                            }
                        ],
                        components: [],
                        ephemeral: true
                    });
                };

                await database.set(`shifts.${member.id}.${Seth.OnDutyStartTime}`, Date.now());
                await database.set(`shifts.${member.id}.${Seth.OnDutyStatus}`, true);
                await member.roles.add(settings.roles.staff.utilities.on_duty);

                await Undy.post({
                    method: Jazmyn.DiscordJSEvent,
                    interaction: i,
                    channel: settings.channels.shifts,
                    data: {
                        embeds: [
                            {
                                color: Allie.color('Green'),
                                title: `Shift Started`,
                                author: { name: member.user.tag, iconURL: member.displayAvatarURL() },
                                description: `${member.user} started a shift.\n\u200B`,
                                fields: [
                                    {
                                        name: `${member.user.tag}'s All Time Shift Information`,
                                        value: `
                                            > Total Shifts: \`${member.shifts.total ? `${member.shifts.total + 1} shifts (including this one)` : `1 shift (including this one)`}\`.
                                            > Total Time On Duty: \`${member.shifts.duration.onDuty ? ms(member.shifts.duration.onDuty, { long: true }) : `N/A (No time on duty)`}\`.
                                            > Total Time On Break: \`${member.shifts.duration.onBreak ? ms(member.shifts.duration.onBreak, { long: true }) : member.shifts.duration.onDuty ? '0 seconds' : `N/A (No time on duty)`}\`.
                                            \u200B
                                            `
                                    }
                                ]
                            }
                        ]
                    }
                });

                await i.update({
                    embeds: [
                        {
                            color: Allie.color('Green'),
                            title: `Shift Started`,
                            author: { name: member.user.tag, iconURL: member.displayAvatarURL() },
                            description: `You have started ${member.lines.pluralTag} shift.\n\u200B`,
                            fields: [
                                {
                                    name: `${member.user.tag}'s All Time Shift Information`,
                                    value: `
                                        > Total Shifts: \`${member.shifts.total ? `${member.shifts.total + 1} shifts (including this one)` : `1 shift (including this one)`}\`.
                                        > Total Time On Duty: \`${member.shifts.duration.onDuty ? ms(member.shifts.duration.onDuty, { long: true }) : `N/A (No time on duty)`}\`.
                                        > Total Time On Break: \`${member.shifts.duration.onBreak ? ms(member.shifts.duration.onBreak, { long: true }) : member.shifts.duration.onDuty ? '0 seconds' : `N/A (No time on duty)`}\`.
                                        \u200B
                                        `
                                }
                            ]
                        }
                    ],
                    components: [],
                    ephemeral: true,
                });
            } 
            
            else if (i.values[0] === 'break') {

                if (!member.shifts.status.onDuty && !member.shifts.status.onBreak) {

                    return await i.update({
                        embeds: [
                            {
                                color: settings.color,
                                author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                                description: `${member.lines.pluralUppercaseTag} do not ${member.lines.has} an active shift.\n\u200B`,
                                fields: [
                                    {
                                        name: `${member.lines.pluralUppercaseTag} All Time Shift Information`,
                                        value: `
                                            > Total Shifts: \`${member.shifts.total ? `${member.shifts.total + 1} shifts (including current shift)` : `1 shift (including current shift)`}\`.
                                            > Total Time On Duty: \`${member.shift.duration.onDuty ? ms(member.shifts.duration.onDuty, { long: true }) : `N/A (No time on duty)`}\`.
                                            > Total Time On Break: \`${member.shifts.duration.onBreak ? ms(member.shifts.duration.onBreak, { long: true }) : member.shifts.duration.onDuty ? '0 seconds' : `N/A (No time on duty)`}\`.
                                            \u200B
                                            `
                                    }
                                ]
                            }
                        ],
                        components: [],
                        ephemeral: true,
                    });
                }
                else if (member.shifts.status.onBreak) {

                    const TimeOnBreak = Date.now() - await database.get(`shifts.${member.id}.start_time.on_break`);

                    await member.roles.remove(settings.roles.staff.utilities.on_break);
                    await member.roles.add(settings.roles.staff.utilities.on_duty);
                    await database.set(`shifts.${member.id}.duration.on_break`, TimeOnBreak);
                    await database.set(`shifts.${member.id}.status.on_break`, false);
                    await database.set(`shifts.${member.id}.status.on_duty`, true);

                    await Undy.post({
                        method: Jazmyn.DiscordJSEvent,
                        channel: settings.channels.shifts,
                        interaction: i,
                        data: {
                            username: `Staff Shifts`,
                            embeds: [
                                {
                                    color: Allie.color('Green'),
                                    author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                                    description: `${member.user} is no longer on break.\n\u200B`,
                                    fields: [
                                        {
                                            name: `${member.lines.pluralUppercaseTag} All Time Shift Information`,
                                            value: `
                                                > Total Shifts: \`${member.shifts.total ? `${member.shifts.total + 1} shifts (including current shift)` : `1 shift (including current shift)`}\`.
                                                > Total Time On Duty: \`${member.shifts.duration.onDuty ? ms(member.shifts.duration.onDuty, { long: true }) : `N/A (No time on duty)`}\`.
                                                > Total Time On Break: \`${member.shifts.duration.onBreak ? ms(member.shifts.duration.onBreak, { long: true }) : member.shifts.duration.onDuty ? '0 seconds' : `N/A (No time on duty)`}\`.
                                                \u200B
                                                `
                                        }
                                    ]
                                }
                            ],
                        }
                    });

                    return await i.update({
                        embeds: [
                            {
                                color: Allie.color('Green'),
                                author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                                description: `${member.lines.pluralUppercaseTag} ${member.lines.is} no longer break.\n\u200B`,
                                fields: [
                                    {
                                        name: `${member.lines.pluralUppercaseTag} All Time Shift Information`,
                                        value: `
                                            > Total Shifts: \`${member.shifts.total ? `${member.shifts.total + 1} shifts (including current shift)` : `1 shift (including current shift)`}\`.
                                            > Total Time On Duty: \`${member.shifts.duration.onDuty ? ms(member.shifts.duration.onDuty, { long: true }) : `N/A (No time on duty)`}\`.
                                            > Total Time On Break: \`${member.shifts.duration.onBreak ? ms(member.shifts.duration.onBreak, { long: true }) : member.shifts.duration.onDuty ? '0 seconds' : `N/A (No time on duty)`}\`.
                                            \u200B
                                            `
                                    }
                                ]
                            }
                        ],
                        components: [],
                        ephemeral: true,
                    });
                };

                await member.roles.remove(settings.roles.staff.utilities.on_duty);
                await member.roles.add(settings.roles.staff.utilities.on_break);
                await database.set(`shifts.${member.id}.status.on_break`, true);
                await database.set(`shifts.${member.id}.start_time.on_break`, Date.now());
                await database.set(`shifts.${member.id}.status.on_duty`, false);

                await Undy.post({
                    method: Jazmyn.DiscordJSEvent,
                    channel: settings.channels.shifts,
                    interaction: i,
                    data: {
                        username: `Staff Shifts`,
                        embeds: [
                            {
                                color: Allie.color('Yellow'),
                                author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                                description: `${member.user} is on break.\n\u200B`,
                                fields: [
                                    {
                                        name: `${member.lines.pluralUppercaseTag} All Time Shift Information`,
                                        value: `
                                            > Total Shifts: \`${member.shifts.total ? `${member.shifts.total + 1} shifts (including current shift)` : `1 shift (including current shift)`}\`.
                                            > Total Time On Duty: \`${member.shifts.duration.onDuty ? ms(member.shifts.duration.onDuty, { long: true }) : `N/A (No time on duty)`}\`.
                                            > Total Time On Break: \`${member.shifts.duration.onBreak ? ms(member.shifts.duration.onBreak, { long: true }) : member.shifts.duration.onDuty ? '0 seconds' : `N/A (No time on duty)`}\`.
                                            \u200B
                                            `
                                    }
                                ]
                            }
                        ],
                    }
                });

                return await i.update({
                    embeds: [
                        {
                            color: Allie.color('Yellow'),
                            author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                            description: `${member.lines.pluralUppercaseTag} ${member.lines.is} on break.\n\u200B`,
                            fields: [
                                {
                                    name: `${member.lines.pluralUppercaseTag} All Time Shift Information`,
                                    value: `
                                        > Total Shifts: \`${member.shifts.total ? `${member.shifts.total + 1} shifts (including current shift)` : `1 shift (including current shift)`}\`.
                                        > Total Time On Duty: \`${member.shifts.duration.onDuty ? ms(member.shifts.duration.onDuty, { long: true }) : `N/A (No time on duty)`}\`.
                                        > Total Time On Break: \`${member.shifts.duration.onBreak ? ms(member.shifts.duration.onBreak, { long: true }) : member.shifts.duration.onDuty ? '0 seconds' : `N/A (No time on duty)`}\`.
                                        \u200B
                                        `
                                }
                            ]
                        }
                    ],
                    components: [],
                    ephemeral: true,
                });
            }
            else if (i.values[0] === `end`) {

                if (!member.shifts.status.onDuty && !member.shifts.status.onBreak)
                    return await i.update({
                        embeds: [
                            {
                                color: settings.color,
                                author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                                description: `${member.lines.name} ${member.lines.do} not have an active shift.`,
                                thumbnail: { url: interaction.guild.iconURL() }
                            }
                        ],
                        components: [],
                        ephemeral: true,
                    });

                const onDutyStartTime = await database.get(`shifts.${member.id}.${Seth.OnDutyStartTime}`) ?? 0;
                const totalDuration = Date.now() - onDutyStartTime;
                const onBreakDuration = await database.get(`shifts.${member.id}.${Seth.OnBreakDuration}`) ?? 0;
                const onDutyDuration = totalDuration - onBreakDuration;

                await database.add(`shifts.${member.id}.${Seth.OnBreakDuration}`, onBreakDuration);
                await database.add(`shifts.${member.id}.${Seth.OnDutyDuration}`, onDutyDuration);
                await database.add(`shifts.${member.id}.${Seth.TotalShifts}`, 1);
                await database.set(`shifts.${member.id}.${Seth.OnDutyStatus}`, false);
                await database.set(`shifts.${member.id}.${Seth.OnBreakStatus}`, false);
                await database.delete(`shifts.${member.id}.${Seth.OnDutyStartTime}`);
                await database.delete(`shifts.${member.id}.${Seth.OnBreakStartTime}`);
                await member.roles.remove(settings.roles.staff.utilities.on_duty);

                let embed = {
                    color: Allie.color('Red'),
                    title: 'Shift Ended',
                    author: { name: member.user.tag, icon_url: member.displayAvatarURL() },
                    fields: [
                        {
                            name: `This Shift's Information`,
                            value: `
                                > Time On Break: \`${onBreakDuration ? ms(onBreakDuration, { long: true }) : `0 seconds`}\`.
                                > Time On Duty: \`${onDutyDuration ? ms(onDutyDuration, { long: true }) : `0 seconds`}\`.
                                > Total Duration: \`${totalDuration ? ms(totalDuration, { long: true }) : `0 seconds`}\`.
                                > Shift Started: <t:${Math.floor(onDutyStartTime / 1000)}:f> (<t:${Math.floor(onDutyStartTime / 1000)}:R>).
                                \u200B`
                        },
                        {
                            name: `All Time Information`,
                            value: `
                                > Total Shifts: \`${member.shifts.total ? `${member.shifts.total + 1} shifts` : `1 shift`}\`.
                                > Time On Break: \`${member.shifts.duration.onBreak ? ms(member.shifts.duration.onDuty + onBreakDuration, { long: true }) : onBreakDuration ? ms(onBreakDuration, { long: true }) : `0 seconds`}\`.
                                > Time On Duty: \`${member.shifts.duration.onDuty ? ms(member.shifts.duration.onDuty + onDutyDuration, { long: true }) : onDutyDuration ? ms(onDutyDuration, { long: true }) : `0 seconds`}\`.
                                \u200B`
                        }
                    ]
                };

                if (interaction.member.id === i.member.id)
                    embed.description = `${i.user} ended a shift.\n\u200B`;
                else
                    embed.description = `${i.user} ended ${member}'s shift.\n\u200B`;

                await Undy.post({
                    method: Jazmyn.DiscordJSEvent,
                    interaction: i,
                    channel: settings.channels.shifts,
                    data: {
                        username: `Staff Shifts`,
                        embeds: [embed],
                        ephemeral: true
                    }
                });

                embed.description = `You have ended ${member.lines.pluralUppercaseTag} shift. Have an amazing day/night!\n\u200B`;

                await i.update({
                    embeds: [embed],
                    components: [],
                    ephemeral: true,
                });
            };
        });

        collector.on('end', async (i) => {
            if (i.size === 0) {
                return await interaction.editReply({
                    content: `Interaction expired after 60 seconds.`,
                    embeds: [],
                    components: [],
                    ephemeral: true
                });
            };
        });
    }
    else if (interaction.options.getSubcommandGroup() === 'server' && interaction.options.getSubcommand() === 'status') {

        const server = interaction.options.getString('server');

        if (server === 'whitelisted' || interaction.guild.id !== '932845698662162432')
            return await interaction.reply({ 
                content: await Stylus.fetchQuote(),
                ephemeral: settings.ephemeral 
            });

        else if (server === 'public') {

            let status = await database.get(`servers.emergency_responce_liberty_county.public.status`);
            let lastUpdated = await database.get(`servers.emergency_responce_liberty_county.public.last_updated`);

            await interaction.reply({
                embeds: [
                    {
                        color: settings.color,
                        title: `Manage the Public Server`,
                        author: { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() },
                        description: `🟢 Server Startup\n🔴 Server Shutdown\n\u200B`,
                        thumbnail: { url: interaction.guild.iconURL() },
                        fields: [{ name: `Server Information`, value: `>  Current status: \`${status ?? `Offline`}\`\n>  Last updated: <t:${Math.floor([lastUpdated ?? Date.now()] / 1000)}:R>` }],
                        footer: { text: `\u200b` }
                    },
                ],
                components: [
                    {
                        type: 1,
                        components: (
                            {
                                type: 3,
                                custom_id: 'server',
                                placeholder: 'Manage server options.',
                                min_values: 1,
                                max_values: 1,
                                options: [
                                    { label: 'Server Startup', description: 'Startup the server.', value: 'startup', emoji: `🟢` },
                                    { label: 'Server Shutdown', description: 'Shutdown the server.', value: 'shutdown', emoji: `🔴` }
                                ]
                            }
                        )
                    }
                ],
                ephemeral: settings.ephemeral
            });

            const collector = interaction.channel.createMessageComponentCollector({ 
                filter: i => i.customId === 'server', 
                componentType: 3, 
                max: 1, 
                time: 60000 
            });

            collector.on('collect', async i => {

                await database.set(`servers.emergency_responce_liberty_county.public.last_updated`, Date.now());

                const serverStatusChannel = interaction.client.channels.cache.get(settings.channels.utility.server_status_channels.public);

                let embed = {
                    color: settings.color,
                    author: { name: i.user.tag, icon_url: i.user.displayAvatarURL() },
                    thumbnail: { url: i.guild.iconURL() },
                    fields: [{ name: '<:Time:1058571172406644766> Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>\n\u200b` }]
                };

                const messages = await serverStatusChannel.messages.fetch();
                
                if (messages.size > 0) {
                    const deletedMessages = await serverStatusChannel.bulkDelete(messages.size, true);
                    if (deletedMessages.size != messages.size)
                        embed.push([
                            { 
                                name: '<:Warning:1077725200428306554> Warning', 
                                value: `One or more message in ${serverStatusChannel} cannot be delete because they are above 14 days old.\n\u200b` 
                            }
                        ]);
                }

                if (i.values[0].startsWith(`startup`)) {

                    await database.set(`servers.emergency_responce_liberty_county.public.status`, `Online`);

                    await Undy.post({
                        method: Jazmyn.DiscordJSEvent,
                        channel: settings.channels.moderation.commands,
                        interaction: i,
                        data: {
                            username: `Command Logs`,
                            embeds: [
                                {
                                    color: Allie.color(`Green`),
                                    title: `Server Startup`,
                                    author: { name: i.user.tag, icon_url: i.user.displayAvatarURL() },
                                    description: `${i.user} opened the public server.\n\u200b`,
                                    thumbnail: { url: i.guild.iconURL() },
                                    fields: [{ name: '<:Time:1058571172406644766> Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true }],
                                    footer: { text: `\u200b` }
                                }
                            ]
                        }
                    });

                    await Undy.post({
                        method: Jazmyn.DiscordJSEvent,
                        channel: serverStatusChannel.id,
                        interaction: i,
                        data: {
                            username: `Server Status`,
                            content: `||<@&${settings.notifications.server_startups}>||`,
                            embeds: [
                                {
                                    color: settings.color,
                                    author: { name: `Sent by ${i.member.displayName}`, icon_url: i.user.displayAvatarURL() },
                                    description: `The public server is online.\n\n**Server Code**: ${settings.servers.emergency_responce_liberty_county.public.code}\n**Server Owner**: ${settings.servers.emergency_responce_liberty_county.public.owner}\n**Server Name**: ${settings.servers.emergency_responce_liberty_county.public.name}\n\u200B`,
                                    thumbnail: { url: i.guild.iconURL() },
                                    fields: [{ name: `<:Guidelines:1077715644134473848> Guidelines`, value: `Make sure to read the [In-Game Guidelines](${settings.links.rules.in_game_rules_urls.public}, '${settings.links.rules.in_game_rules_urls.public}') and the [Roblox Community Standards](https://en.help.roblox.com/hc/en-us/articles/203313410-Roblox-Community-Standards 'https://en.help.roblox.com/hc/en-us/articles/203313410-Roblox-Community-Standards') before joining.`, }],
                                    footer: { text: `\u200b` }
                                }
                            ],
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            label: 'Join',
                                            url: `https://policeroleplay.community/join/${settings.servers.emergency_responce_liberty_county.public.code}`,
                                            emoji: { name: 'PRC', id: '1064375772694970559' },
                                            style: 5
                                        }
                                    ]
                                }
                            ]
                        }
                    });

                    embed.description = `I have opened the public server.\n\u200b`;

                    await i.update({
                        embeds: [embed],
                        components: [],
                        ephemeral: settings.ephemeral
                    });
                } else if (i.values[0].startsWith(`shutdown`)) {

                    await database.set(`servers.emergency_responce_liberty_county.public.status`, `Offline`);
                    
                    await Undy.post({
                        method: Jazmyn.DiscordJSEvent,
                        channel: settings.channels.moderation.commands,
                        interaction: i,
                        data: {
                            username: `Command Logs`,
                            embeds: [
                                {
                                    color: Allie.color(`Red`),
                                    title: `Server Shutdown`,
                                    author: { name: i.user.tag, icon_url: i.user.displayAvatarURL() },
                                    description: `${i.user} closed the public server.\n\u200b`,
                                    thumbnail: { url: i.guild.iconURL() },
                                    fields: [
                                        { name: '<:Time:1058571172406644766> Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>\n\u200b` },
                                        { name: '<:Uptime:1077728044497768568> Uptime', value: `${ms(Date.now() - lastUpdated, { long: true })}` }
                                    ],
                                    footer: { text: `\u200b` }
                                }
                            ]
                        }
                    });

                    await Undy.post({
                        method: Jazmyn.DiscordJSEvent,
                        channel: serverStatusChannel.id,
                        interaction: i,
                        data: {
                            username: `Server Status`,
                            embeds: [
                                {
                                    color: settings.color,
                                    author: { name: `Sent by ${i.member.displayName}`, icon_url: i.user.displayAvatarURL() },
                                    description: `**${settings.servers.emergency_responce_liberty_county.public.name}** is closed. You can **not** join the server.\n\n*Please wait for the next server startup to be hosted.*\n\u200B`,
                                    thumbnail: { url: i.guild.iconURL() },
                                    fields: [
                                        { name: `When will the server open again?`, value: `>  The server opens each day at 12:00 PM UTC unless complications occur.`, inline: true },
                                        { name: `Become Notified`, value: `>  You can add the [Server Startup Notification](https://discord.com/channels/932845698662162432/942242160550506526) so you can be the first to know when our server opens.`, inline: true }
                                    ],
                                    footer: { text: `\u200b` }
                                }
                            ]
                        }
                    });

                    embed.description = `I have closed the public server.\n\u200b`;
                    embed.fields.push({ 
                        name: '<:Uptime:1077728044497768568> Uptime', 
                        value: `${ms(Date.now() - lastUpdated, { long: true })}\n\u200b` 
                    });

                    await i.update({
                        embeds: [embed],
                        components: [],
                        ephemeral: true
                    });
                };
            });

            collector.on('end', async (i) => {
                if (i.size === 0) {
                    return await interaction.editReply({
                        content: `Interaction expired after 60 seconds.`,
                        embeds: [],
                        components: [],
                        ephemeral: true
                    });
                };
            });
        };
    };
}