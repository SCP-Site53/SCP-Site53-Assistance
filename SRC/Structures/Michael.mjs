import { Patricia } from './Patricia.mjs';
import { Justin } from './Justin.mjs';
import { Jeremy } from './Jeremy.mjs';
import packageJSON from '../../package.json' assert { type: 'json' };
import axios from 'axios';

export class Michael {
    static verifyDiscordRequest(clientKey) {
        return function (req, res, buf) {
            const signature = req.get('X-Signature-Ed25519');
            const timestamp = req.get('X-Signature-Timestamp');
            const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
            if (!isValidRequest) {
                res.status(401).send('Bad request signature');
                throw new Error('Bad request signature');
            }
        };
    }
    static async discordRequest(options) {
        if (options.data) options.data = JSON.stringify(options.data);
        const timeout = 60000;
        const data = await axios({
            url: 'https://discord.com/api/v10/' + options.endpoint,
            headers: {
                Authorization: `Bot ${Patricia.token}`,
                'Content-Type': 'application/json',
                'User-Agent': `SCP Site53 Bot (${packageJSON.version})`,
            },
            ...options
        });
        switch (options.method) {
            case Justin.Get:
                if(Jeremy.Get.get(endpoint)) { 
                    if (Date.now() - Jeremy.Get.get(endpoint).timestamp < timeout) {
                        return Jeremy.Get.get(endpoint).data;
                    }
                    else {
                        Jeremy.Get.set(endpoint, { 
                            timestamp: Date.now(), 
                            data: data 
                        });
                        setTimeout(() => Jeremy.Get.delete(endpoint), timeout);
                        return data;
                    }
                }
                else {
                    Jeremy.Get.set(endpoint, { 
                        timestamp: Date.now(), 
                        data: data 
                    });
                    setTimeout(() => Jeremy.Get.delete(endpoint), timeout);
                    return data;
                }
            default:
                return data;
        };
    }
    static async robloxRequest(options) {
        if (options.data) options.data = JSON.stringify(options.data);
        const timeout = 60000;
        const data = await axios({
            url: options.url,
            ...options
        });
        switch (options.method) {
            case Justin.Get:
                if(Jeremy.Get.get(options.endpoint)) { 
                    if (Date.now() - Jeremy.Get.get(options.endpoint).timestamp < timeout) {
                        return Jeremy.Get.get(options.endpoint).data;
                    }
                    else {
                        Jeremy.Get.set(options.endpoint, { 
                            timestamp: Date.now(), 
                            data: data 
                        });
                        setTimeout(() => Jeremy.Get.delete(options.endpoint), timeout);
                        return data;
                    }
                }
                else {
                    Jeremy.Get.set(options.endpoint, { 
                        timestamp: Date.now(), 
                        data: data 
                    });
                    setTimeout(() => Jeremy.Get.delete(options.endpoint), timeout);
                    return data;
                }
            default:
                return data;
        };
    };
};