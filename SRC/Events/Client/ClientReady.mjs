import { Patricia } from '../../Structures/Patricia.mjs';
import { Oliver } from '../../Structures/Oliver.mjs';
import { Garnotin } from '../../Structures/Garnotin.mjs';
import { Justin } from '../../Structures/Justin.mjs';

export const name = Justin.Events.ClientReady;
export const once = true;
export async function Execute(client) {

    await Garnotin.info(`Client is ready! Logged in as ${client.user.tag}`);

    const serverOnlineStatuses = [
        { name: `Site53`, type: 0 }, 
        { name: `${client.guilds.cache.map(guild => guild.memberCount).reduce((p, c) => p + c)} users`, type: 3 }, 
        { name: `your requests`, type: 2 }
    ];
    const serverOfflineStatuses = [
        { name: `${client.guilds.cache.map(guild => guild.memberCount).reduce((p, c) => p + c)} users`, type: 3 }, 
        { name: `your requests`, type: 2 }
    ];

    setInterval(async () => {

        const serverOnlineStatus = serverOnlineStatuses[Math.floor(Math.random() * serverOnlineStatuses.length)];
        const serverOfflineStatus = serverOfflineStatuses[Math.floor(Math.random() * serverOfflineStatuses.length)];

        const serverStatus = await new Oliver().get('servers.emergency_responce_liberty_county.public.status');

        if (serverStatus === 'Offline' || !serverStatus) {
            client.user.setActivity(serverOfflineStatus.name, { type: serverOfflineStatus.type });
        }
        else {
            client.user.setActivity(serverOnlineStatus.name, { type: serverOnlineStatus.type });
        };
        
    }, 3000);

    try {
        await Patricia.reloadApplicationCommands(client.user.id);
    } catch (error) {
        throw error;
    };
};