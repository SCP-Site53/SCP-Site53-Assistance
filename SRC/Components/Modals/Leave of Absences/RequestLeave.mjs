import { Undy } from '../../../Structures/Undy.mjs';
import { Stylus } from '../../../Structures/Stylus.mjs';
import { Jazmyn } from '../../../Structures/Jazmyn.mjs';
import { Ana } from '../../../Structures/Ana.mjs';
import ms from 'ms';

export const data = { identity: 'request-leave' };
export async function Execute({ interaction, database, settings }) {
    if (!await Stylus.check(interaction))
        return await interaction.reply({ content: await Stylus.message(), ephemeral: settings.ephemeral });
    const days = ms(interaction.fields.getTextInputValue('days'));
    const reason = interaction.fields.getTextInputValue('reason');
    interaction.user.leaveOfAbsences = {
        last: await database.get(`leave_of_absences.${interaction.user.id}.list.`) ? `<t:${Ana(interaction.user.leaveOfAbsences.list[interaction.user.leaveOfAbsences.list.length - 1])}:d>` : `N/A (No Leaves)`,
        list: await database.get(`leave_of_absences.${interaction.user.id}.list.`) ? await database.get(`leave_of_absences.${interaction.user.id}.List.`) : `N/A (No Leaves)`,
        dates: await database.get(`leave_of_absences.${interaction.user.id}.list.`) ? await database.get(`leave_of_absences.${interaction.user.id}.List.`).map(leave => `<t:${Math.floor(leave.start / 1000)}:d>`).join(`, `) : `N/A (No Leaves)`
    };
    await Undy.Post({
        method: Jazmyn.DiscordJSInteraction,
        channel: settings.channels.utility.leave_of_absences.request,
        interaction: interaction,
        data: {
            username: `Leave Notice`,
            embeds: [
                {
                    color: settings.color,
                    title: `Leave Notice`,
                    author: { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() },
                    description: `${interaction.user} is on a leave of absence.`,
                    thumbnail: { url: interaction.guild.iconURL() },
                    fields: [
                        { name: `Reason`, value: `${reason}` },
                        { name: `Staff Member's Previous Leaves`, value: `${interaction.user.leaveOfAbsences.dates}` },
                        { name: `Staff Member's Last Leave`, value: `${interaction.user.leaveOfAbsences.last}` },
                        { name: `Staff Member's Highest Rank`, value: `${interaction.member.roles.highest}` },
                        { name: `Duration`, value: `${ms(days, { long: true })}.` },
                        { name: `Ends`, value: `<t:${Math.floor((Date.now() + days) / 1000)}> (<t:${Math.floor((Date.now() + days) / 1000)}:R>).` }
                    ],
                    timestamp: new Date().toISOString(),
                    footer: settings.footer
                }
            ]
        }
    });
    await database.push(`leave_of_absences.active`, interaction.user.id);
    await database.push(`leave_of_absences.${interaction.user.id}.list`, {
        start: Date.now(),
        issuer: interaction.user.id,
        end: Date.now() + days
    });
    interaction.member.roles.add(settings.roles.staff.utilities.leave_of_absence);
    await interaction.reply({
        embeds: [
            {
                color: settings.color,
                author: { name: interaction.guild.name, iconURL: interaction.guild.iconURL() },
                description: `Your leave request was accepted.`,
                thumbnail: { url: interaction.guild.iconURL() },
                fields: [
                    { name: `Duration`, value: `${ms(days, { long: true })}.` },
                    { name: `Expires On`, value: `<t:${Math.floor((Date.now() + days) / 1000)}> (<t:${Math.floor((Date.now() + days) / 1000)}:R>).` }
                ],
                timestamp: new Date.toISOString(),
                footer: settings.footer
            }
        ],
        ephemeral: settings.ephemeral
    });
}