import axios from 'axios';

export const data = {
    type: 1,
    name: 'quote',
    description: 'Fetches a quote from an API.',
    options: [
        {
            type: 3,
            name: 'api',
            description: 'The API to fetch.',
            choices: [
                { name: 'Quoteable', value: 'Quotable' },
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
    if (api === 'Quotable') {
        const res = await axios.get('https://api.quotable.io/random');
        const data = await res.data;
        message = data.content + ' -' + data.author;
    } 
    else if (api === 'ZenQuotes.io') {
        const res = await axios.get('https://zenquotes.io/api/random');
        const data = await res.data;
        message = data[0].q + ' -' + data[0].a;
    } 
    else if (api === 'Some Random Api') {
        const res = await axios.get('https://some-random-api.ml/animu/quote');
        const data = await res.data;
        message = data.sentence + ' -' + data.character;
    } 
    else {
        throw new Error(`Invalid API: ${api}.`);
    }
    await interaction.reply({ content: message });
}