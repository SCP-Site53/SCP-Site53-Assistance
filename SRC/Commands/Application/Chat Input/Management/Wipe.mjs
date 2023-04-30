import { Stylus } from '../../../../Structures/Stylus.mjs';

export const data = {
    type: 1,
    name: 'wipes',
    description: 'Wipes something.',
    options: [
        {
            type: 2,
            name: 'staff',
            description: 'Wipes something including staff.',
            options: [
                { 
                    type: 1, 
                    name: 'shifts', 
                    description: 'Wipes all staff shifts.' 
                }
            ]
        }
    ]
};
export async function Execute({ interaction, database, settings }) {
    if (interaction.options.getSubcommand() === 'shifts') {
        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            return await interaction.reply({ 
                content: await Stylus.fetchQuote(), 
                ephemeral: settings.ephemeral 
            });
        }
        await database.delete('shifts');
        
        await interaction.reply({
            embeds: [
                {
                    color: settings.color,
                    title: `Shifts Wiped`,
                    author: { name: interaction.user.tag, icon_url: interaction.user.displayAvatarURL() },
                    description: `I sucessfully wiped all shift data.`,
                    timestamp: new Date().toISOString(),
                    footer: settings.footer
                }
            ],
            ephemeral: settings.ephemeral
        });
    };
}