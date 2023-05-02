import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

export const data = { identity: `appeals` };
export async function Execute({ interaction }) {
    if (interaction.values[0] === "warning") {
        await interaction.showModal(
            new ModalBuilder()
                .setCustomId('warning-appeal')
                .setTitle('Warning Appeal')
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('punishment')
                                .setMaxLength(1000)
                                .setLabel("Why were you warned?")
                                .setStyle(TextInputStyle.Short)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('appeal')
                                .setMaxLength(1000)
                                .setLabel("Why should we remove your warning?")
                                .setStyle(TextInputStyle.Paragraph)
                        )
                )
        );
    }
    else if (interaction.values[0] === "kick") {
        await interaction.showModal(
            new ModalBuilder()
                .setCustomId('kick-appeal')
                .setTitle('Kick Appeal')
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('punishment')
                                .setMaxLength(1000)
                                .setLabel("Why were you kicked?")
                                .setStyle(TextInputStyle.Short)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('appeal')
                                .setMaxLength(1000)
                                .setLabel("Why should we remove your kick from our logs?")
                                .setStyle(TextInputStyle.Paragraph)
                        )
                )
        );
    }
    else if (interaction.values[0] === "ban") {
        await interaction.showModal(
            new ModalBuilder()
                .setCustomId('ban-appeal')
                .setTitle('Ban Appeal')
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('punishment')
                                .setMaxLength(1000)
                                .setLabel("Why were you banned?")
                                .setStyle(TextInputStyle.Short)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('appeal')
                                .setMaxLength(1000)
                                .setLabel("Why should we unban you and/or remove your ban from our logs?")
                                .setStyle(TextInputStyle.Paragraph)
                        )
                )
        );
    }
    else if (interaction.values[0] === "strike") {
        await interaction.showModal(
            new ModalBuilder()
                .setCustomId('strike-appeal')
                .setTitle('Strike Appeal')
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('punishment')
                                .setMaxLength(100)
                                .setLabel("Why were you striked?")
                                .setStyle(TextInputStyle.Short)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('appeal')
                                .setMaxLength(1000)
                                .setLabel("Why should the strike be removed?")
                                .setStyle(TextInputStyle.Paragraph)
                        )
                )
        );
    };
}