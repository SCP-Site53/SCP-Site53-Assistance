import axios from 'axios';

export const data = {
    type: 1,
    name: 'anime',
    description: 'Fetches an anime image from an API.',
    options: [
        { type: 1, name: 'palm', description: 'Fetches an anime face palm image from an API.' },
        { type: 1, name: 'hug', description: 'Fetches an anime hug image from an API.' },
        { type: 1, name: 'pat', description: 'Fetches an anime pat image from an API.' },
        { type: 1, name: 'quote', description: 'Fetches an anime quote from an API.' },
        { type: 1, name: 'wink', description: 'Fetches an anime wink image from an API.' }
    ]
};

export async function Execute({ interaction, settings }) {
    if (interaction.options.getSubcommand() === 'hug') {
        const response = await axios.get('https://some-random-api.ml/animu/face-palm');
        const data = await response.data;
        await interaction.reply({
            embeds: [
                {
                    color: settings.color,
                    title: 'Anime Face Palm',
                    url: data.link,
                    author: { name: interaction.user.tag, icon_url: interaction.user.displayAvatarURL() },
                    image: { url: data.link }
                }
            ]
        });
    }
    else if (interaction.options.getSubcommand() === 'hug') {
        const response = await axios.get('https://some-random-api.ml/animu/hug');
        const data = await response.data;
        await interaction.reply({
            embeds: [
                {
                    color: settings.color,
                    title: 'Anime Hug',
                    url: data.link,
                    author: { name: interaction.user.tag, icon_url: interaction.user.displayAvatarURL() },
                    image: { url: data.link }
                }
            ]
        });
    }
    else if (interaction.options.getSubcommand() === 'pat') {
        const response = await axios.get('https://some-random-api.ml/animu/pat');
        const data = await response.data;
        await interaction.reply({
            embeds: [
                {
                    color: settings.color,
                    title: 'Anime Pat',
                    url: data.link,
                    author: { name: interaction.user.tag, icon_url: interaction.user.displayAvatarURL() },
                    image: { url: data.link }
                }
            ]
        });
    }
    else if (interaction.options.getSubcommand() === 'quote') {
        const response = await axios.get('https://some-random-api.ml/animu/quote');
        const data = await response.data;
        await interaction.reply({
            embeds: [
                {
                    color: settings.color,
                    title: `Anime Quote From ${data.anime}`,
                    url: 'https://some-random-api.ml/animu/quote',
                    description: `${data.sentence} - ${data.character}`
                }
            ]
        });
    }
    else if (interaction.options.getSubcommand() === 'wink') {
        const response = await axios.get('https://some-random-api.ml/animu/wink');
        const data = await response.data;
        await interaction.reply({
            embeds: [
                {
                    color: settings.color,
                    title: 'Anime Wink',
                    url: data.link,
                    author: { name: interaction.user.tag, icon_url: interaction.user.displayAvatarURL() },
                    image: { url: data.link }
                }
            ]
        });
    };
}