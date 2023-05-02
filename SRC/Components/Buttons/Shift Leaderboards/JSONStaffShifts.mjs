import { Jack } from '../../../Structures/Jack.mjs';
import { Stylus } from '../../../Structures/Stylus.mjs';

const duration = new Jack();

export const data = { identity: 'json-staff-shifts', };
export async function Execute({ interaction, database, settings }) {
    if (!await Stylus.check(interaction))
        return await interaction.reply({ 
            content: await Stylus.message(), 
            ephemeral: settings.ephemeral 
        });

    const members = interaction.guild.members.fetch();
    const staffMembers = members.filter(member => 
        member.permissions.has('ADMINISTRATOR') 
        || 
        member.roles.cache.some(role => 
            [
                ...settings.roles.staff.ranks.moderator, 
                ...settings.roles.staff.ranks.administrator, 
                ...settings.roles.staff.ranks.fairs, 
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
        setImmediate(async () => {
            duration.delete(staffMember.id);
        });
    };

    setImmediate(async () => {

        const shiftData = [
            duration
            .sort((a, b) => a.duration.on_duty - b.duration.on_duty)
            .filter(data => interaction.client.users.cache.get(data.user))
            .map(data, position => ({
                position: position + 1,
                user: {
                    id: data.user,
                    username: interaction.client.users.cache.get(data.user).username,
                    discriminator: interaction.client.users.cache.get(data.user).discriminator
                },
                duration: data.duration
            }))
        ];

        await interaction.reply({
            content: `${interaction.user}, here is your converted staff shifts leaderboard file.`,
            files: [
                {
                    data: { name: `${interaction.guild.name}_staff_shifts_leaderboard.json` },
                    attachment: Buffer.from({
                        time: new Date().toISOString(),
                        guild: {
                            id: interaction.guild.id,
                            name: interaction.guild.name,
                        },
                        data: shiftData ? shiftData : null
                    })
                }
            ],
            ephemeral: settings.ephemeral
        });
    });
}