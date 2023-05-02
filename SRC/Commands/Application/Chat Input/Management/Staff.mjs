import { Jack } from '../../../../Structures/Jack.mjs';
import { Stylus } from '../../../../Structures/Stylus.mjs';
import ms from 'ms';

const duration = new Jack();

export const data = {
    type: 1,
    name: 'staff',
    description: 'Does something with staff shifts',
    options: [
        {
            type: 2,
            name: 'shift',
            description: 'Does something with staff shifts',
            options: [
                { 
                    type: 1, 
                    name: 'leaderboard', 
                    description: 'View the staff shifts leaderboard.' 
                }
            ]
        }
    ]
};
export async function Execute({ interaction, database, settings }) {

    if (!await Stylus.check(interaction)) {
        return await interaction.reply({ 
            content: await Stylus.fetchQuote(), 
            ephemeral: settings.ephemeral 
        });
    };

    if (interaction.options.getSubcommand() === 'leaderboard') {

        const members = await interaction.guild.members.fetch();

        const staffMembers = members.filter(
            member => member.permissions.has(`ADMINISTRATOR`) 
            || 
            member.roles.cache.some(role => 
                [
                    ...settings.roles.staff.ranks.moderator, 
                    ...settings.roles.staff.ranks.administrator, 
                    ...settings.roles.staff.ranks.internal_affairs, 
                    ...settings.roles.staff.ranks.management, 
                    ...settings.roles.staff.ranks.executive
                ]
                .includes(role.id)
            )
        );

        for (const staffMember of staffMembers) {
            
            const onDutyDuration = await database.get(`shifts.${staffMember.id}.duration.on_duty`);

            if (onDutyDuration > 0) {
                duration.set(staffMember.id, {
                    user: staffMember.id,
                    duration: onDutyDuration
                });
            };

            setImmediate(() => {
                duration.delete(staffMember.id);
            });
        };

        setImmediate(async () => {

            let list = duration
            .sort((a, b) => a.duration - b.duration)
            .filter(data => interaction.client.users.cache.get(data.user))
            .first(100)
            .map((data, position) => `> **${position + 1}**. ${(interaction.client.users.cache.get(data.user))}: \`${ms(data.duration, { long: true })}\`.`)
            .join('\n');

            if (list.length > 4000) {
                list = list.substring(0, 3997) + "...";
            };

            await interaction.reply({
                embeds: [
                    {
                        color: settings.color,
                        title: 'Staff Shifts Leaderboard',
                        author: { name: interaction.guild.name, iconURL: interaction.guild.iconURL() },
                        description: list ? list : 'No staff shift data.',
                        thumbnail: { url: interaction.guild.iconURL() }
                    }
                ],
                components: [
                    { 
                        type: 1, 
                        components: [
                            { 
                                type: 2, 
                                customId: `txt-staff-shifts`, 
                                label: `Convert to TXT File`, 
                                style: 2 
                            }
                        ]    
                    }
                ],
                ephemeral: settings.ephemeral
            });
        });
    };
}