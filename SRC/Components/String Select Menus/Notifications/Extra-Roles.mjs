export const data = { identity: 'extra-roles' };
export async function Execute({ interaction, settings }) {
    
    const removed = interaction.component.options.filter((option) => {
        return !interaction.values.includes(option.value);
    });

    for (const id of removed) {
        interaction.member.roles.remove(id.value);
    };

    for (const id of interaction.values) {
        interaction.member.roles.add(id);
    };

    await interaction.reply({
        embeds: [
            {
                color: settings.color,
                author: { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() },
                description: `I have updated your notification settings!`,
                thumbanil: { url: interaction.guild.iconURL() },
                timestamp: new Date().toISOString()
            }
        ],
        ephemeral: true,
    });
}