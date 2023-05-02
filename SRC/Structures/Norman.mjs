/**
 * Converts timestamps and dates to time formats.
 * 
 * ```js
 * import { Norman } = from 'Norman';
 * 
 * //Creates a Norman with the current time.
 * const norman = new Norman(Date.now());
 * ```
 * 
 * Norman will throw a `TypeError` if `miliseconds` is not a `number`.
 * 
 * @param miliseconds The miliseconds to convert.
 * @since v2023.2.16
 */
export class Norman {
    static toTimestamp(milliseconds = null) {
        if (milliseconds === null) return `Never.`;
        return Date.now() + milliseconds;
    }
    static toDate(milliseconds = null) {
        if (milliseconds === null) return `Never.`;
        return new Date(Date.now() + milliseconds).toDateString();
    }
    /**
     * Converts timestamps to a Discord message timestamp format.
     * 
     * https://discord.com/developers/docs/reference
     * 
     * ```js
     * import { Norman } = from 'Norman';
     * 
     * //Creates a Norman with the current time.
     * const time = Norman.toDiscord({
     *      miliseconds: 2190392537,
     *      style: 'R'
     * });
     * 
     * //Logs <t:2190392537:R>.
     * console.log(time);
     * ```
     * 
     * Norman will throw a `TypeError` if `style` is invalid or `miliseconds` is not a `number`.
     * 
     * @returns <t:timestmap:style>
     * @since v2023.2.16
     */
    static toDiscord({ milliseconds = 0, style = undefined }) {
        if (milliseconds < 0) return `Never.`;
        if (style === undefined) throw new Error(`Norman is missing second argument (Style).`);
        if (style != "t" && style != "T" && style != "d" && style != "D" && style != "f*" && style != "F" && style != "R") throw new Error(`Norman needs a valid second argument (Style).`);
        return `<t:${Math.floor(Date.now() + milliseconds / 1000)}:${style}>`;
    }
    constructor(milliseconds) {
        if (!milliseconds) return `Never.`;
        if (isNaN(milliseconds)) throw new Error(`Norman's first argument (Milliseconds) needs to be a number.`);
        this.milliseconds = Date.now() + milliseconds;
    }
    toTimestamp() {
        return this.milliseconds;
    }
    date() {
        return new Date(this.milliseconds).toDateString();
    }
    /**
     * Converts timestamps to a Discord message timestamp format.
     * 
     * https://discord.com/developers/docs/reference
     * 
     * ```js
     * import { Norman } = from 'Norman';
     * 
     * //Creates a Norman with the current time.
     * const norman = new Norman(Date.now());
     * 
     * const discordFormat = norman.toDiscord(style);
     * ```
     * 
     * Norman will throw a `TypeError` if `style` is invalid.
     * 
     * @param {string} style The Discord time format style.
     * @returns <t:timestmap:style>
     * @since v2023.2.16
     */
    toDiscord(style = null) {
        if (style === null) throw new Error(`Norman is missing second argument (Style).`);
        if (style != "t" && style != "T" && style != "d" && style != "D" && style != "f*" && style != "F" && style != "R") throw new Error(`Norman needs a valid second argument (Style).`);
        return `<t:${Math.floor(Date.now() + milliseconds / 1000)}:${style}>`;
    }
};