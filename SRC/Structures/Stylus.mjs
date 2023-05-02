import { Oliver } from './Oliver.mjs';
import axios from 'axios';

export class Stylus {
    /**
     * Checks if a member is a staff member or has `ADMINISTRATOR` permissions. This will only work for Node.js Discord events.
     * ```js
     * import { Stylus } from 'Stylus';
     * 
     * event.on('event' => {
     * 
     *      //Checks if a person is a staff member.
     *      const isStaffMember = new Stylus().check(event);
     * 
     *      //Logs a boolean.
     *      console.log(isStaffMember);
     * });
     * ```
     * Stylus will throw a `TypeError` if `event` is not a Node.js Discord event.
     * @param {object} event - Declare a Node.js Discord event. 
     * @returns {boolean}
     * @since v2023.3.20
     */
    static async check(event) {
        return this.check(event);
    }
    /**
     * Fetches a quote from an application programming interface.
     * ```js
     * import { Stylus } from 'Stylus';
     * 
     * //Fetches a quote from the Quotable application programming interface.
     * const quote = await new Stylus().fetchQuote('Quotable');
     * 
     * //Logs quote to the console.
     * console.log(quote);
     * ```
     * If `api` does not specify a supported application programming interface (Quoteable, ZenQuotes.io, or Some Random Api), it will throw a `TypeError`.
     * @param {string} api 
     * @returns {string}
     * @since v2023.3.20
     */
    static async fetchQuote(api) {
        return this.fetchQuote(api);
    }
    /**
     * @deprecated
     * @param {string} api - Delare the API to fetch a quote from.
     * @returns {string}
     * @since v2023.3.20
     */
    static async message(api) {
        return this.fetchQuote(api);
    }
    /**
     * Checks if a member is a staff member or has `ADMINISTRATOR` permissions. This will only work for Node.js Discord events.
     * ```js
     * import { Stylus } from 'Stylus';
     * 
     * event.on('event' => {
     * 
     *      //Checks if a person is a staff member.
     *      const isStaffMember = new Stylus().check(event);
     * 
     *      //Logs a boolean.
     *      console.log(isStaffMember);
     * });
     * ```
     * Stylus will throw a `TypeError` if `event` is not a Node.js Discord event.
     * @param {object} event - Declare a Node.js Discord event. 
     * @returns {boolean}
     * @since v2023.3.20
     */
    async check(event) {
        const database = new Oliver({ guild: event.guild.id });
        const settings = await database.get('settings');
        if (!event.member.permissions.has('ADMINISTRATOR')) {
            if (event.member.roles.cache.some(role => [
                ...settings.roles.staff.ranks.moderator,
                ...settings.roles.staff.ranks.administrator,
                ...settings.roles.staff.ranks.internal_affairs,
                ...settings.roles.staff.ranks.management,
                ...settings.roles.staff.ranks.executive
            ]
                .includes(role.id)))
                return true;
            return false;
        }
        return true;
    }
    /**
     * Fetches a quote from an application programming interface.
     * ```js
     * import { Stylus } from 'Stylus';
     * 
     * //Fetches a quote from the Quotable application programming interface.
     * const quote = await new Stylus().fetchQuote('Quotable');
     * 
     * //Logs quote to the console.
     * console.log(quote);
     * ```
     * If `api` does not specify a supported application programming interface (Quoteable, ZenQuotes.io, or Some Random Api), it will throw a `TypeError`.
     * @param {string} api 
     * @returns {string}
     * @since v2023.3.20
     */
    async fetchQuote(api = 'Quotable') {
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
            throw new TypeError(`We do not support the ${api}${api.toLowerCase().endsWith('api') ? '' : ' API'}.`);
        }
        return message;
    }
    /**
     * @deprecated
     * @param {string} api - The API to fetch a quote from.
     * @returns {string}
     * @since v2023.3.20
     */
    async message() {
        return this.fetchQuote();
    }
}