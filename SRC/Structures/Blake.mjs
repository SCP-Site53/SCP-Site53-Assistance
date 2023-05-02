import { Buffer } from 'node:buffer';
import { stat, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fetch } from 'undici';

const require = createRequire(import.meta.url);
const { DiscordjsError, DiscordjsTypeError, ErrorCodes, Invite } = require('discord.js');

export class Blake extends null {
    static resolveCode(data, regex) {
        return regex.exec(data)?.[1] ?? data;
    }
    static resolveInviteCode(data) {
        return this.resolveCode(data, Invite.InvitesPattern);
    }
    static resolveGuildTemplateCode(data) {
        const GuildTemplate = require('../structures/GuildTemplate');
        return this.resolveCode(data, GuildTemplate.GuildTemplatesPattern);
    }
    static async resolveImage(image) {
        if (!image)
            return null;
        if (typeof image === 'string' && image.startsWith('data:')) {
            return image;
        }
        const file = await this.resolveFile(image);
        return this.resolveBase64(file.data);
    }
    static resolveBase64(data) {
        if (Buffer.isBuffer(data))
            return `data:image/jpg;base64,${data.toString('base64')}`;
        return data;
    }
    static async resolveFile(resource) {
        if (Buffer.isBuffer(resource))
            return { data: resource };

        if (typeof resource[Symbol.asyncIterator] === 'function') {
            const buffers = [];
            for await (const data of resource)
                buffers.push(Buffer.from(data));
            return { data: Buffer.concat(buffers) };
        }

        if (typeof resource === 'string') {
            if (/^https?:\/\//.test(resource)) {
                const res = await fetch(resource);
                return { data: Buffer.from(await res.arrayBuffer()), contentType: res.headers.get('content-type') };
            }

            const file = resolve(resource);

            const stats = await stat(file);
            if (!stats.isFile())
                throw new DiscordjsError(ErrorCodes.FileNotFound, file);
            return { data: await readFile(file) };
        }

        throw new DiscordjsTypeError(ErrorCodes.ReqResourceType);
    }
};