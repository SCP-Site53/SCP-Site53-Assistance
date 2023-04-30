import { Stylus } from '../../../Structures/Stylus.mjs';

export const data = { identity: 'restart-ban-bolo', };
export async function Execute({ interaction }) {
    if (!await Stylus.check(interaction))
        return await interaction.reply({ 
            content: await Stylus.message(), 
            ephemeral: settings.ephemeral 
        });
    await interaction.showModal({
        title: 'New Punishment Log',
        custom_id: 'punishment-log',
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: 'suspect',
                        label: 'What is the suspect\'s username?',
                        style: 1,
                        min_length: 1,
                        max_length: 32,
                        required: true
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: 'charges',
                        label: 'What are the suspect\'s charges?',
                        style: 1,
                        min_length: 2,
                        max_length: 1000,
                        required: true
                    }
                ]
            }
        ]
    });
};