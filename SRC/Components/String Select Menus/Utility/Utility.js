import { Execute as ExecuteUptimeCommand } from '../../../Commands/Application/Chat Input/Utility/Uptime.mjs';
import { Execute as ExecutePingCommand } from '../../../Commands/Application/Chat Input/Utility/Ping.mjs';

export const data = { identity: 'utilities' };
export async function Execute({ interaction, settings }) {
    if (interaction.values[0] === 'uptime') {
        await ExecuteUptimeCommand({ 
            interaction: interaction, 
            settings: settings 
        });
    }
    else if (interaction.values[0] === 'ping') {
        await ExecutePingCommand({ 
            interaction: interaction, 
            settings: settings 
        });
    };
}