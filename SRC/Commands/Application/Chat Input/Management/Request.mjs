import { Stylus } from '../../../../Structures/Stylus.mjs';

export const data = {
    type: 1,
    name: 'request',
    description: 'Request something.',
    options: [
        { 
            type: 1, 
            name: 'leave', 
            description: 'Request a leave of absence.' 
        }
    ]
};
export async function Execute({ interaction, settings }) {
    if (interaction.options.getSubcommand() === 'leave') {
        
        if (!await Stylus.check(interaction)) {
            return await interaction.reply({ 
                content: await Stylus.fetchQuote(), 
                ephemeral: settings.ephemeral 
            });
        };
        
        await interaction.showModal({
            custom_id: 'request-leave',
            title: `${interaction.guild.name} Staff Leave Request`,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: 'days',
                            max_length: 100,
                            label: 'How many days will you be on leave?',
                            placeholder: 'Numbers and letters only (no periods)',
                            style: 1
                        }
                    ]
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: 'reason',
                            max_length: 100,
                            label: 'What is the reason for this leave?',
                            placeholder: 'No reason specified.',
                            style: 2
                        }
                    ]
                }
            ]
        });
    };
}