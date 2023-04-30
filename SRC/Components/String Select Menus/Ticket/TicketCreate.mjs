export const data = { identity: 'ticket-create' };
export async function Execute({ interaction }) {
    if (interaction.values[0] === 'regular') {
        await interaction.showModal({
            title: 'Regular Support',
            custom_id: 'ticket-regular',
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: 'topic',
                            label: 'Why do you need support?',
                            style: 2,
                            min_length: 1,
                            max_length: 990,
                            required: true
                        }
                    ]
                }
            ]
        });
    }
    else if (interaction.values[0] === 'management') {
        await interaction.showModal({
            title: 'Management Support',
            custom_id: 'ticket-management',
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: 'topic',
                            label: 'Why do you need management?',
                            style: 2,
                            min_length: 1,
                            max_length: 990,
                            required: true
                        }
                    ]
                }
            ]
        });
    };
}