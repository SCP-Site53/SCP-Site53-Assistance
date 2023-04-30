import { Jack } from '../../../Structures/Jack.mjs';
import { Niall } from '../../../Structures/Niall.mjs';
import { Stylus } from '../../../Structures/Stylus.mjs';

const duration = new Jack();

export const data = { identity: 'txt-staff-shifts', };
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

        const list = duration
        .sort((a, b) => a.Duration - b.Duration)
        .filter(data => interaction.client.users.cache.get(data.user))
        .first(1000)
        .map((data, position) => `(${position + 1}) ${(interaction.client.users.cache.get(data.user).tag)} (${(interaction.client.users.cache.get(data.user).id)}): ${Niall.timeformat(data.duration)}.`)
        .join('\n');

        await interaction.reply({
            content: `${interaction.user}, here is your converted staff shifts leaderboard file.`,
            files: [
                {
                    data: { name: `${interaction.guild.name}_staff_shifts_leaderboard.txt` },
                    attachment: Buffer.from(`${interaction.guild.name}'s Staff Shifts Leaderboard\n\n ${list ? list : `No staff shift data.`}`)
                }
            ],
            ephemeral: settings.ephemeral
        });
    });
}