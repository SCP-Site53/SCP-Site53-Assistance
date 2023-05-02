import { Michael } from './Michael.mjs';
import { Justin } from './Justin.mjs';
import { Undy } from './Undy.mjs';
import { Allie } from './Allie.mjs';
import { Jazmyn } from './Jazmyn.mjs';

export class Garnotin {
    /**
     * Logs an information to the console, a file, and a Discord webhook.
     * ```js
     * import { Garnotin } from 'Garnotin';
     * 
     * const message = 'Information.';
     * 
     * (async () => {
     *      //Logs to the console, a file, and a Discord webhook (after rate limits).
     *      await Garnotin.info(message);
     * })();
     * ```
     * Garnotin will throw a `TypeError` if `message` is empty.
     * @param {*} message - Declare a message.
     */
    static async info(message) {
        const res = await Michael.discordRequest({ endpoint: 'users/@me', method: Justin.Get });
        const bot = await res.data;
        Undy.post({
            method: Jazmyn.DiscordAPIPost,
            channel: '1063944522519806003',
            data: {
                username: `Console Information Messages`,
                embeds: [
                    {
                        color: Allie.color("7f0000"),
                        author: { name: `${bot.username}#${bot.discriminator}`, icon_url: `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png` },
                        title: `Console Recieved an Information Message`,
                        description: `From <@${bot.id}>, sent at <t:${Math.floor(Date.now() / 1000)}:R>.\n\n\u200b**Message**\n\`\`\`${message}\`\`\``,
                        footer: { text: `\u200b` }
                    }
                ]
            }
        });
        console.info(`Info: ${message}`);
        return;
    };

    /**
     * Logs a debug message to the console, a file, and a Discord webhook.
     * ```js
     * import { Garnotin } from 'Garnotin';
     * 
     * const message = 'Debug message.';
     * 
     * (async () => {
     *      //Logs to the console, a file, and a Discord webhook (after rate limits).
     *      await Garnotin.debug(message);
     * })();
     * ```
     * Garnotin will throw a `TypeError` if `message` is empty.
     * @param {*} message - Delare a debug message.
     */
    static async debug(message) {
        const res = await Michael.discordRequest({ endpoint: 'users/@me', method: Justin.Get });
        const bot = await res.data;
        Undy.post({
            method: Jazmyn.DiscordAPIPost,
            channel: '1063944472896999455',
            data: {
                username: `Console Debugging Messages`,
                embeds: [
                    {
                        color: Allie.color("7f0000"),
                        author: { name: `${bot.username}#${bot.discriminator}`, icon_url: `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png` },
                        title: `Console Recieved a Debugging Message`,
                        description: `From <@${bot.id}>, sent at <t:${Math.floor(Date.now() / 1000)}:R>.\n\n\u200b**Message**\`\`\`${message}\`\`\``,
                        footer: { text: `\u200b` }
                    }
                ]
            }
        });
        console.info(`Debug: ${message}`);
        return;
    };

    /**
     * Logs a warning to the console, a file, and a Discord webhook.
     * ```js
     * import { Garnotin } from 'Garnotin';
     * 
     * const warning = 'Warning: detected an issue.';
     * 
     * (async () => {
     *      //Logs to the console, a file, and a Discord webhook (after rate limits).
     *      await Garnotin.info(warning);
     * })();
     * ```
     * Garnotin will throw a `TypeError` if `warning` is empty.
     * @param {*} warning - Throw a warning.
     */
    static async warning(warning) {
        const res = await Michael.discordRequest({ endpoint: 'users/@me', method: Justin.Get });
        const bot = await res.data;
        Undy.post({
            method: Jazmyn.DiscordAPIPost,
            channel: '1063944496712274110',
            data: {
                username: `Console Warning Messages`,
                embeds: [
                    {
                        color: Allie.color("7f0000"),
                        author: { name: `${bot.username}#${bot.discriminator}`, icon_url: `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png` },
                        title: warning,
                        description: `An warning was recived in <@${bot.id}> at <t:${Math.floor(Date.now() / 1000)}:R>.\n\n\u200b**Message**\`\`\`${warning}\`\`\``,
                        footer: { text: `\u200b` }
                    }
                ]
            }
        });
        return;
    };

    /**
     * Logs an error to the console, a file, and a Discord webhook.
     * ```js
     * import { Garnotin } from 'Garnotin';
     * 
     * const error = new Error('Fatal error.');
     * 
     * (async () => {
     *      //Logs to the console, a file, and a Discord webhook (after rate limits).
     *      await Garnotin.info(error);
     * })();
     * ```
     * Garnotin will log a `TypeError` if `error` is empty.
     * @param {*} error - Throw an error.
     */
    static async error(error) {
        const res = await Michael.discordRequest({ endpoint: 'users/@me', method: Justin.Get });
        const bot = await res.data;
        Undy.post({
            method: Jazmyn.DiscordAPIPost,
            channel: '1063944453552885851',
            data: {
                username: `Console Warning Messages`,
                embeds: [
                    {
                        color: Allie.color("7f0000"),
                        author: { name: `${bot.username}#${bot.discriminator}`, icon_url: `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png` },
                        title: error.message,
                        description: `An error was detected in <@${bot.id}> <t:${Math.floor(Date.now() / 1000)}:R>.\n\n\u200b**Stack**\`\`\`${error.stack ?? error}\`\`\``,
                        footer: { text: `\u200b` }
                    }
                ]
            }
        });
        console.error(error.stack ?? error);
        return;
    };
}
