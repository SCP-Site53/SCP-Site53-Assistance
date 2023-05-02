import { Oliver } from './Oliver.mjs';
import { Undy } from './Undy.mjs';
import { Norman } from './Norman.mjs';
import { Jazmyn } from './Jazmyn.mjs';

export class Stryder {
    
    /**
     * A ban function of a moderation manager; Stryder.
     * 
     * **Discord API Example**
     * ```js
     * import { Stryder } from 'Stryder';
     * 
     * event.on('event', async event => {
     *      await Stryder.ban({
     *          event: event,
     *          caseIdentiy: Date.now()
     *          target: 328930189213238,
     *          days: 3,
     *          reason: 'No reason specified',
     *          note: 'No note written'
     *      });
     * });
     * ```
     * 
     * **discord.js Example**
     * ```js
     * import { Stryder } from 'Stryder';
     * 
     * event.on('event', async event => {
     *      await Stryder.ban({
     *          event: event,
     *          caseIdentiy: Date.now()
     *      });
     * });
     * ```
     * Stryder will throw a `TypeError` if `event` or `caseIdentity` is undefined.
     * @param {*} param0
     * @since v2023.3.24
     */
    static async ban({ 
        event = undefined, 
        caseIdentity = undefined, 
        target = event.options.getUser('user'), 
        days = event.options.getNumber('days'), 
        expires = new Norman(Date.now() + days * 86400000), 
        reason = event.options.getString('reason'), 
        note = event.options.getString('note') 
    }) {

        if (!event || !caseIdentity) {
            throw new Error(`Missing one or more required parameters ("event" and "caseIdentity").`);
        };
        
        const database = new Oliver({ guild: event.guild.id });
        const settings = await database.get(`settings`);

        event.guild.members.ban(target, {
            days: days,
            reason: [`Issuer: ${event.user.tag} (${event.user.id}),\nExpires: ${expires.toDate()},\nReason: ${reason ?? 'No reason specified.'}`]
        });

        await Undy.post({
            method: Jazmyn.DiscordJSEvent,
            event: event, 
            channel: await database.get(`settings.channels.moderation.commands`),
            data: {
                username: `Command Logs`,
                embeds: [
                    {
                        color: settings.color,
                        author: { name: target.tag, icon_url: target.displayAvatarURL() },
                        title: `User Banned`,
                        description: `${event.user} banned ${target}.`,
                        thumbnail: { url: event.guild.iconURL() },
                        fields: [
                            { name: `<:Note:1058571206380507146> Note`, value: `${note ?? `No note issued.`}.\n\u200b` },
                            { name: `<:Expires:1058571172406644766> Ban Expires`, value: `${expires.toDiscord('R')}.\n\u200b` },
                            { name: `<:Case:1073069924794241084:> Case Identity`, value: `${caseIdentity}\n\u200b` },
                            { name: `<:Reason:1058559451763855390> Reason`, value: `${reason ?? `No reason specified.`}` }
                        ],
                        footer: { text: `\u200b` }
                    }
                ]
            }
        });

        await database.push(`moderations.users.${target.id}`, caseIdentity);
        await database.set(`moderations.identities.${caseIdentity}`, {
            case_identity: caseIdentity,
            time_issued: new Date().toISOString(),
            target: target,
            issuer: event.user.id,
            punishment: `ban`,
            reason: reason ?? `No reason specified.`,
            note: note ?? `No note issued.`,
            expires: expires.toTimestamp()
        });
    };

    /**
     * A kick function of a moderation manager; Stryder.
     * 
     * **Discord API Example**
     * ```js
     * import { Stryder } from 'Stryder';
     * 
     * event.on('event', async event => {
     *      await Stryder.kick({
     *          event: event,
     *          caseIdentiy: Date.now()
     *          target: 328930189213238,
     *          reason: 'No reason specified',
     *          note: 'No note written'
     *      });
     * });
     * ```
     * 
     * **discord.js Example**
     * ```js
     * import { Stryder } from 'Stryder';
     * 
     * event.on('event', async event => {
     *      await Stryder.kick({
     *          event: event,
     *          caseIdentiy: Date.now()
     *      });
     * });
     * ```
     * Stryder will throw a `TypeError` if `event` or `caseIdentity` is undefined.
     * @param {*} param0
     * @since v2023.3.24
     */
    static async kick({ 
        event = undefined, 
        caseIdentity = undefined, 
        target = event.options.getUser('user'), 
        reason = event.options.getString('reason'), 
        note = event.options.getString('note') 
    }) {

        if (!event || !caseIdentity) {
            throw new Error(`Missing one or more required parameters ("event" and "caseIdentity").`);
        };
        
        const database = new Oliver({ guild: options.module.guild.id });
        const settings = await database.get(`settings`);

        target.kick({
            reason: [`Issuer: ${event.user.tag} (${event.user.id}),\nReason: ${reason ?? 'No reason specified.'}`]
        });

        await Undy.post({
            method: Jazmyn.DiscordJSEvent,
            event: options.module, 
            channel: await database.get(`settings.channels.moderation.commands`),
            data: {
                username: `Command Logs`,
                embeds: [
                    {
                        color: settings.color,
                        author: { name: target.user.tag, icon_url: target.user.displayAvatarURL() },
                        title: `Member Kicked`,
                        description: `${event.user} kicked ${target}.`,
                        thumbnail: { url: data.module.guild.iconURL() },
                        fields: [
                            { name: `<:Note:1058571206380507146> Note`, value: `${note ?? `No note issued.`}.\n\u200b` },
                            { name: `<:Case:1073069924794241084:> Case Identity`, value: `${caseIdentity}\n\u200b` },
                            { name: `<:Reason:1058559451763855390> Reason`, value: `${reason ?? `No reason specified.`}` }
                        ],
                        footer: { text: `\u200b` }
                    }
                ]
            }
        });
        await data.database.push(`moderations.users.${target.id}`, caseIdentity);
        await data.database.set(`moderations.identities.${caseIdentity}`, {
            case_identity: caseIdentity,
            time_issued: new Date().toISOString(),
            target: target,
            issuer: event.user.id,
            punishment: `kick`,
            reason: reason ?? `No reason specified.`,
            note: note ?? `No note issued.`
        });
    };

    /**
     * A mute function of a moderation manager; Stryder.
     * 
     * **Discord API Example**
     * ```js
     * import { Stryder } from 'Stryder';
     * 
     * event.on('event', async event => {
     *      await Stryder.mute({
     *          event: event,
     *          caseIdentiy: Date.now()
     *          target: 328930189213238,
     *          duration: 2938
     *          reason: 'No reason specified',
     *          note: 'No note written'
     *      });
     * });
     * ```
     * 
     * **discord.js Example**
     * ```js
     * import { Stryder } from 'Stryder';
     * 
     * event.on('event', async event => {
     *      await Stryder.mute({
     *          event: event,
     *          caseIdentiy: Date.now()
     *      });
     * });
     * ```
     * Stryder will throw a `TypeError` if `event` or `caseIdentity` is undefined.
     * @param {*} param0
     * @since v2023.3.24
     */
    static async mute({
        event = undefined, 
        caseIdentity = undefined, 
        target = event.options.getUser('member'), 
        duration = event.options.getNumber('duration'), 
        expires = new Norman(Date.now() + (duration * 1000)), 
        reason = event.options.getString('reason'), 
        note = event.options.getString('note')
    }) {

        if (!event || !caseIdentity) {
            throw new Error(`Missing one or more required parameters ("event" and "caseIdentity").`);
        };
        
        const database = new Oliver({ guild: event.guild.id });
        const settings = await database.get(`settings`);

        target.timeout(duration, `Moderator: ${event.user.tag} (${event.user.id}),\nExpires: ${expires.date()},\nReason: ${data.reason ?? 'No reason specified.'}`);
        
        await Undy.post({
            method: Jazmyn.DiscordJSEvent,
            event: event, 
            channel: await database.get(`settings.channels.moderation.commands`),
            data: {
                username: `Command Logs`,
                embeds: [
                    {
                        color: settings.color,
                        author: { name: target.user.tag, icon_url: target.user.displayAvatarURL() },
                        title: `Member Muted`,
                        description: `${event.user} muted ${target}.`,
                        thumbnail: { url: event.guild.iconURL() },
                        fields: [
                            { name: `<:Note:1058571206380507146> Note`, value: `${note ?? `No note issued.`}.\n\u200b` },
                            { name: `<:Expires:1058571172406644766> Mute Expires`, value: `${expires.discord('R')}.\n\u200b` },
                            { name: `<:Case:1073069924794241084:> Case Identity`, value: `${caseIdentity}\n\u200b` },
                            { name: `<:Reason:1058559451763855390> Reason`, value: `${reason ?? `No reason specified.`}` }
                        ],
                        footer: { text: `\u200b` }
                    }
                ]
            }
        });
        await database.push(`moderations.users.${target.id}`, caseIdentity);
        await database.set(`moderations.identities.${caseIdentity}`, {
            case_identity: caseIdentity,
            time_issued: new Date().toISOString(),
            target: target,
            issuer: event.user.id,
            punishment: `timeout/mute`,
            reason: reason ?? `No reason specified.`,
            note: note ?? `No note issued.`,
            expires: expires.toTimestamp()
        });
    };

    /**
     * A timeout function of a moderation manager; Stryder.
     * 
     * **Discord API Example**
     * ```js
     * import { Stryder } from 'Stryder';
     * 
     * event.on('event', async event => {
     *      await Stryder.timeout({
     *          event: event,
     *          caseIdentiy: Date.now()
     *          target: 328930189213238,
     *          duration: 2938
     *          reason: 'No reason specified',
     *          note: 'No note written'
     *      });
     * });
     * ```
     * 
     * **discord.js Example**
     * ```js
     * import { Stryder } from 'Stryder';
     * 
     * event.on('event', async event => {
     *      await Stryder.timeout({
     *          event: event,
     *          caseIdentiy: Date.now()
     *      });
     * });
     * ```
     * Stryder will throw a `TypeError` if `event` or `caseIdentity` is undefined.
     * @param {*} param0
     * @since v2023.3.24
     */
    static async timeout({
        event = undefined, 
        caseIdentity = undefined, 
        target = event.options.getUser('member'), 
        duration = event.options.getNumber('duration'), 
        expires = new Norman(Date.now() + (duration * 1000)), 
        reason = event.options.getString('reason'), 
        note = event.options.getString('note')
    }) {

        if (!event || !caseIdentity) {
            throw new Error(`Missing one or more required parameters ("event" and "caseIdentity").`);
        };
        
        const database = new Oliver({ guild: event.guild.id });
        const settings = await database.get(`settings`);

        target.timeout(duration, `Moderator: ${event.user.tag} (${event.user.id}),\nExpires: ${expires.date()},\nReason: ${data.reason ?? 'No reason specified.'}`);
        
        await Undy.post({
            method: Jazmyn.DiscordJSEvent,
            event: event, 
            channel: await database.get(`settings.channels.moderation.commands`),
            data: {
                username: `Command Logs`,
                embeds: [
                    {
                        color: settings.color,
                        author: { name: target.user.tag, icon_url: target.user.displayAvatarURL() },
                        title: `Member Timedout`,
                        description: `${event.user} timedout ${target}.`,
                        thumbnail: { url: event.guild.iconURL() },
                        fields: [
                            { name: `<:Note:1058571206380507146> Note`, value: `${note ?? `No note issued.`}.\n\u200b` },
                            { name: `<:Expires:1058571172406644766> Mute Expires`, value: `${expires.discord('R')}.\n\u200b` },
                            { name: `<:Case:1073069924794241084:> Case Identity`, value: `${caseIdentity}\n\u200b` },
                            { name: `<:Reason:1058559451763855390> Reason`, value: `${reason ?? `No reason specified.`}` }
                        ],
                        footer: { text: `\u200b` }
                    }
                ]
            }
        });
        await database.push(`moderations.users.${target.id}`, caseIdentity);
        await database.set(`moderations.identities.${caseIdentity}`, {
            case_identity: caseIdentity,
            time_issued: new Date().toISOString(),
            target: target,
            issuer: event.user.id,
            punishment: `timeout/mute`,
            reason: reason ?? `No reason specified.`,
            note: note ?? `No note issued.`,
            expires: expires.toTimestamp()
        });
    };

    /**
     * A warn function of a moderation manager; Stryder.
     * 
     * **Discord API Example**
     * ```js
     * import { Stryder } from 'Stryder';
     * 
     * event.on('event', async event => {
     *      await Stryder.warn({
     *          event: event,
     *          caseIdentiy: Date.now()
     *          target: 328930189213238,
     *          reason: 'No reason specified',
     *          note: 'No note written'
     *      });
     * });
     * ```
     * 
     * **discord.js Example**
     * ```js
     * import { Stryder } from 'Stryder';
     * 
     * event.on('event', async event => {
     *      await Stryder.warn({
     *          event: event,
     *          caseIdentiy: Date.now()
     *      });
     * });
     * ```
     * Stryder will throw a `TypeError` if `event` or `caseIdentity` is undefined.
     * @param {*} param0
     * @since v2023.3.24
     */
    static async warn({ 
        event = undefined, 
        caseIdentity = undefined, 
        target = event.options.getUser('user'), 
        reason = event.options.getString('reason'), 
        note = event.options.getString('note') 
    }) {

        if (!event || !caseIdentity) {
            throw new Error(`Missing one or more required parameters ("event" and "caseIdentity").`);
        };
        
        const database = new Oliver({ guild: event.guild.id });
        const settings = await database.get(`settings`);

        await Undy.post({
            method: Jazmyn.DiscordJSEvent,
            event: event, 
            channel: await database.get(`settings.channels.moderation.commands`),
            data: {
                username: `Command Logs`,
                embeds: [
                    {
                        color: settings.color,
                        author: { name: target.tag, icon_url: target.displayAvatarURL() },
                        title: `Member Warned`,
                        description: `${event.user} warned ${target}.`,
                        thumbnail: { url: event.guild.iconURL() },
                        fields: [
                            { name: `<:Note:1058571206380507146> Note`, value: `${note ?? `No note issued.`}.\n\u200b` },
                            { name: `<:Case:1073069924794241084:> Case Identity`, value: `${caseIdentity}\n\u200b` },
                            { name: `<:Reason:1058559451763855390> Reason`, value: `${reason ?? `No reason specified.`}` }
                        ],
                        footer: { text: `\u200b` }
                    }
                ]
            }
        });

        await database.push(`moderations.users.${target.id}`, caseIdentity);
        await database.set(`moderations.identities.${caseIdentity}`, {
            case_identity: caseIdentity,
            time_issued: new Date().toISOString(),
            target: target,
            issuer: event.user.id,
            punishment: `warning`,
            reason: reason ?? `No reason specified.`,
            note: note ?? `No note issued.`,
        });
    };
}