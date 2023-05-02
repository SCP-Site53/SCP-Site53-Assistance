import { Oliver } from './Oliver.mjs';
import { Frontier } from './Frontier.mjs';
import { Garnotin } from './Garnotin.mjs';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import config from '../../Utilities/Config/Config.json' assert { type: 'json' };
import defaultSettings from '../../Utilities/File Examples/Settings.json' assert { type: 'json' };

const require = createRequire(import.meta.url);
const { Client, IntentsBitField, REST, Routes } = require('discord.js');
const database = new Oliver();
const eventsPath = join(dirname(fileURLToPath(import.meta.url)), '../Events');
const eventsFolders = readdirSync(eventsPath);
const { token } = config;

export class Patricia {

    /**
     * The Discord.js client.
     * @since v2023.3.24
     */
    static client = new Client({ intents: new IntentsBitField(32767) });

    /**
     * The Discord bot token.
     * @since v2023.3.24
     */
    static token = token;
    
    /**
     * Connects the bot to the rest of the files.
     * @param {*} token 
     * @since v2023.3.24
     */
    static async login(token = this.token) {
        await database.set(`settings`, defaultSettings);

        for (const folder of eventsFolders) {

            const folderPath = join(eventsPath, folder);
            const eventFiles = readdirSync(folderPath).filter(file => file.endsWith('.js') || file.endsWith('.mjs'));

            for (const file of eventFiles) {
                
                const filePath = join(folderPath, file);
                const event = await import(Frontier.fromCProtocolToFileDataProtocol(filePath));

                if (event.once)
                    this.client.once(event.name, (...args) => event.Execute(...args));
                else if (event.process)
                    process.on(event.name, (...args) => event.Execute(...args));
                else
                    this.client.on(event.name, (...args) => event.Execute(...args));
            };
        };
        this.client.login(token = this.token);
    };

    /**
     * Refreshes application commands.
     * ```js
     * import { Patricia } from 'Patricia';
     * import config from 'Config.json';
     * 
     * (async () => {
     * 
     *      //Global
     *      await Patricia.reloadApplicationCommands(config.application.identity);
     * 
     *      //Guild
     *      await Patricia.reloadApplicationCommands(config.mainGuild.identity); 
     * })();
     * ```
     * `Patricia` will throw a `TypeError` if `clientIdentity` is missing.
     * @param {number} applicationIdentity 
     * @param {number} guildIdentity 
     * @param {string} token 
     * @since v2023.3.24
     */
    static async reloadApplicationCommands(applicationIdentity, guildIdentity = false, token = this.token) {

        if (!applicationIdentity)
            throw new TypeError('Missing application identity.');

        const commands = [];

        await Garnotin.info(`Started refreshing ${commands.length} application (/) commands.`);

        for (const file of Frontier.recursiveReaddirSync(join(dirname(fileURLToPath(import.meta.url)), '../Commands/Application'))) {
            const { data } = await import(Frontier.fromCProtocolToFileDataProtocol(file));
            commands.push(data);
        };

        const rest = new REST({ version: '10' }).setToken(token);
        const data = await rest.put(
            (
                guildIdentity 
                ? Routes.applicationCommands(applicationIdentity, guildIdentity) 
                : Routes.applicationCommands(applicationIdentity)
            ), 
            { body: commands }
        );

        await Garnotin.info(`Successfully reloaded ${data.length} application (/) commands.`);
    };
};