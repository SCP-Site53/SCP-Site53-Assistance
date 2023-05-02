import { Jack } from '../../../Structures/Jack.mjs';
import { Stylus } from '../../../Structures/Stylus.mjs';

export const data = { type: 2, name: 'Warn' };
export const victims = new Jack();
export async function Execute({ interaction, settings }) {

    if(!Stylus.check(interaction)) 
        return interaction.reply({ 
            content: Stylus.message(), 
            ephemeral: settings.ephemeral 
        });

    const member = interaction.guild.members.cache.get(interaction.targetId);

    victims.set(interaction.user.id, member);

    setTimeout(() => { 
        victims.delete(interaction.user.id); 
    }, 300000);

    await interaction.showModal({
        custom_id: 'warn',
        title: `${member.user.username}#${member.user.discriminator}'s Warning Information`,
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: 'note',
                        max_length: 990,
                        label: 'Write a note about the warning.',
                        placeholder: 'No note written.',
                        style: 2
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: 'reason',
                        max_length: 990,
                        label: 'Specify a reason for the warning.',
                        placeholder: 'No reason specified.',
                        style: 2
                    }
                ]
            }
        ]
    });
};