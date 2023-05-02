import { Undy } from '../../Structures/Undy.mjs';
import { Justin } from '../../Structures/Justin.mjs';
import { Jazmyn } from '../../Structures/Jazmyn.mjs';
import message from '../../../Utilities/Messages/Embeds/SCPSite53StrikePolicy.json' assert { type: 'json' };

export const name = Justin.Events.ClientReady;
export const once = true;
export async function Execute(client) {
    return;
    console.log('Started posting a message.');
    Undy.Post({
        method: Jazmyn.DiscordJSClient,
        channel: '1026003569905762354',
        client: client,
        data: {
            username: `SCP Site53 Staff Strike Policy`, 
            embeds: message.embeds 
        }
    });
};