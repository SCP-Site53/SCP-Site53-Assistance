export const data = {
    type: 1,
    name: 'setup',
    description: 'Setup something.',
    options: [
        {
            type: 2,
            name: 'staff',
            description: 'Setup something including staff.',
            default_permission: 'ADMINISTRATOR',
            options: [
                {
                    type: 1,
                    name: 'permissions',
                    description: 'Setup permissions for staff.'
                }
            ]
        },
    ]
};
export async function Execute({ interaction, database, settings }) {
    
    if (interaction.options.getSubcommand() === 'permissions') {

        class Identities {
            static Save = `save_permissions`;
            static Cancel = `cancel_permissions`;
            static Executive = `executive`;
            static Management = `management`;
            static InternalAffairs = `internal_Affairs`;
            static Administrator = `administrator`;
            static Moderator = `moderator`;
        };

        const embed = {
            color: settings.color,
            title: `Setup Staff Permissions`,
            author: { name: interaction.user.tag, icon_url: interaction.user.displayAvatarURL() },
            description: `Setup your staff permissions. All staff have access to non-staff commands.\n\u200b`,
            thumbnail: { url: interaction.guild.iconURL() },
            fields: [
                { name: `Executive`, value: `Staff with these roles are the highest members in the server. They can execute any command.\n\u200b` },
                { name: `Management`, value: `Staff with these roles are high ranking members that can edit lower ranks' data and edit server configurations.\n\u200b` },
                { name: `Internal Affairs`, value: `Internal Affairs investigate staff. They can execute anything Moderators can and ticket commands.\n\u200b` },
                { name: `Administrator`, value: `Staff with these roles have the same power as Moderators, but with slightly elevated commands.\n\u200b` },
                { name: `Moderators`, value: `Staff with these roles can execute basic staff commands.` },
            ],
            footer: { text: `\u200b` }
        };

        const roleSelectMenus = {
            Executive: {
                type: 1,
                components: (
                    {
                        type: 6,
                        custom_id: Identities.Executive,
                        placeholder: 'Select Executive roles.',
                        min_values: 1,
                        max_values: 25
                    }
                )
            },
            Management: {
                type: 1,
                components: (
                    {
                        type: 6,
                        custom_id: Identities.Management,
                        placeholder: 'Select Management roles.',
                        min_values: 1,
                        max_values: 25
                    }
                )
            },
            InternalAffairs: {
                type: 1,
                components: (
                    {
                        type: 6,
                        custom_id: Identities.InternalAffairs,
                        placeholder: 'Select Internal Affairs roles.',
                        min_values: 1,
                        max_values: 25
                    }
                )
            },
            Administrator: {
                type: 1,
                components: (
                    {
                        type: 6,
                        custom_id: Identities.Administrator,
                        placeholder: 'Select Administrator roles.',
                        min_values: 1,
                        max_values: 25
                    }
                )
            },
            Moderator: {
                type: 1,
                components: (
                    {
                        type: 6,
                        custom_id: Identities.Moderator,
                        placeholder: 'Select Moderator roles.',
                        min_values: 1,
                        max_values: 25
                    }
                )
            },
        };

        await interaction.reply({
            embeds: [embed],
            components: [
                {
                    type: 1,
                    components: (
                        {
                            type: 3,
                            custom_id: 'setup_staff_role_permissions_options',
                            placeholder: 'Select ranks (4 max).',
                            max_values: 4,
                            options: [
                                { label: `Executive`, description: `Staff with these roles are the highest members in the server. They can execute any command.`, value: Identities.Executive },
                                { label: `Management`, description: `Staff with these roles can edit lower ranks' data and edit server configurations.`, value: Identities.Management },
                                { label: `Internal Affairs`, description: `Internal Affairs investigate staff. They can execute anything Moderators can and ticket commands.`, value: Identities.InternalAffairs },
                                { label: `Administrator`, description: `Staff with these roles have the same power as Moderators, but with slightly elevated commands.`, value: Identities.Administrator },
                                { label: `Moderators`, description: `Staff with these roles can execute basic staff commands.`, value: Identities.Moderator },
                            ]
                        }
                    )
                }
            ],
            ephemeral: settings.ephemeral
        });

        const optionsCollector = interaction.channel.createMessageComponentCollector({
            filter: i => i.customId === 'setup_staff_role_permissions_options',
            componentType: 3,
            max: 1,
            time: 600000
        });

        optionsCollector.on('collect', async (i) => {
            let components = [];
            for (const value of i.values) {
                components.push(roleSelectMenus[value]);
            };
            const message = {
                embeds: [embed],
                components: [
                    ...components,
                    {
                        type: 1,
                        components: [
                            {
                                type: 3,
                                custom_id: Identities.Save,
                                label: 'Save',
                                style: 3
                            },
                            {
                                type: 3,
                                custom_id: Identities.Cancel,
                                label: 'Cancel',
                                style: 2
                            }
                        ]
                    }
                ]
            };

            await i.update(message);

            let executiveRoles = [];
            let managementRoles = [];
            let internalAffairsRoles = [];
            let administratorRoles = [];
            let moderatorRoles = [];

            const saveCollector = i.channel.createMessageComponentCollector({
                filter: i => i.customId === Identities.Save,
                componentType: 2,
                max: 1,
                time: 600000
            });

            const cancelCollector = i.channel.createMessageComponentCollector({
                filter: i => i.customId === Identities.Cancel,
                componentType: 2,
                max: 1,
                time: 600000
            });

            const executiveRolesCollector = i.channel.createMessageComponentCollector({
                filter: i => i.customId === Identities.Executive,
                componentType: 6,
                time: 600000
            });

            const managementRolesCollector = i.channel.createMessageComponentCollector({
                filter: i => i.customId === Identities.Management,
                componentType: 6,
                time: 600000
            });

            const internalAffairsRolesCollector = i.channel.createMessageComponentCollector({
                filter: i => i.customId === Identities.InternalAffairs,
                componentType: 6,
                time: 600000
            });

            const administratorRolesCollector = i.channel.createMessageComponentCollector({
                filter: i => i.customId === Identities.Administrator,
                componentType: 6,
                time: 600000
            });

            const moderatorRolesCollector = i.channel.createMessageComponentCollector({
                filter: i => i.customId === Identities.Moderator,
                componentType: 6,
                time: 600000
            });

            executiveRolesCollector.on('collect', async (i) => {
                await i.update(message);
                executiveRoles = i.values;
            });

            managementRolesCollector.on('collect', async (i) => {
                await i.update(message);
                managementRoles = i.values;
            });

            internalAffairsRolesCollector.on('collect', async (i) => {
                await i.update(message);
                internalAffairsRoles = i.values;
            });

            administratorRolesCollector.on('collect', async (i) => {
                await i.update(message);
                administratorRoles = i.values;
            });

            moderatorRolesCollector.on('collect', async (i) => {
                await i.update(message);
                moderatorRoles = i.values;
            });

            saveCollector.on('collect', async (i) => {

                await i.update({
                    content: `Task completed.`,
                    embeds: [],
                    components: [],
                    ephemeral: settings.ephemeral
                });

                await database.set(`settings.roles.staff.ranks`, {
                    executive: executiveRoles,
                    management: managementRoles,
                    internal_affairs: internalAffairsRoles,
                    administrator: administratorRoles,
                    moderator: moderatorRoles
                });

                return;
            });

            saveCollector.on('end', async (i) => {
                if (i.size < 1)
                    await i.update({
                        content: `Task timedout.`,
                        embeds: [],
                        components: [],
                        ephemeral: settings.ephemeral
                    });
                return;
            });

            cancelCollector.on('collect', async (i) => {
                return await i.update({
                    content: `Task canceled.`,
                    embeds: [],
                    components: [],
                    ephemeral: settings.ephemeral
                });
            });
        });

        optionsCollector.on('end', async (i) => {
            if (i.size < 1)
                await i.update({
                    content: `Task timedout.`,
                    embeds: [],
                    components: [],
                    ephemeral: settings.ephemeral
                });
            return;
        });
    };
};