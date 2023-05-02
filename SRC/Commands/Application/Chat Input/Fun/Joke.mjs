import axios from 'axios';

export const data = {
    type: 1,
    name: 'joke',
    description: 'Fetches a joke from an API (for mature kids and immature adults).',
    options: [
        {
            type: 3,
            name: 'api',
            description: 'The API to fetch.',
            choices: [
                { name: 'Onelord API', value: 'Onelord API' },
                { name: 'JokeAPI', value: 'JokeAPI' },
                { name: 'ZenQuotes.io', value: 'ZenQuotes.io' },
                { name: 'Some Random Api', value: 'Some Random Api' }
            ],
            required: true
        }
    ]
};

export async function Execute({ interaction }) {
    const api = interaction.options.getString('api');
    let message;
    if (api === 'Onelord API') {
        const res = await axios.get('https://jokeapi.dev/joke/Any?safe-mode');
        const data = await res.data;
        message = data.content + ' -' + data.author;
    }
    else if (api === 'JokeAPI') {
        const res = await axios.get('https://jokeapi.dev/joke/Any?safe-mode');
        const data = await res.data;
        message = data.content + ' -' + data.author;
    } else if (api === 'ZenQuotes.io') {
        const res = await axios.get('https://zenquotes.io/api/random');
        const data = await res.data;
        message = data[0].q + ' -' + data[0].a;
    } else if (api === 'Some Random Api') {
        const res = await axios.get('https://some-random-api.ml/joke');
        const data = await res.data;
        message = data.sentence + ' -' + data.character;
    } else {
        throw new Error(`Invalid API: ${api}.`);
    }
    await interaction.reply({ content: message });
}