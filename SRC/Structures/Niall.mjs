export class Niall {
    /**
     * Converts miliseconds to a `string` containing a time format.
     * 
     * ```js
     * import { Niall } = from 'Niall';
     * 
     * //Creates a string subtracting two numbers in time format.
     * const time = Niall.timeformat(602394 - 129328);
     * 
     * // Logs `7 minutes and 53 seconds`.
     * console.log(time);
     * ```
     * 
     * Niall will throw a `TypeError` if `miliseconds` is not a `number`.
     * 
     * @param miliseconds The miliseconds to convert.
     * @since v2023.3.11
     */
    static timeformat(miliseconds) {
        if (isNaN(miliseconds)) throw new TypeError('Milliseconds must be a number.');
        const years = Math.floor(miliseconds / 31557600000);
        const days = Math.floor((miliseconds % 31536000000) / 86400000);
        const hours = Math.floor((miliseconds % 86400000) / 3600000);
        const minutes = Math.floor((miliseconds % 3600000) / 60000);
        const seconds = Math.round((miliseconds % 60000) / 1000);
        let number = 0;
        if (days) number +=1;
        if (hours) number +=1;
        if (minutes) number +=1;
        if (seconds) number +=1;
        const time = (
            (years > 0 ? `${years} ${years > 1 ? 'years' : 'year'}${number > 2 ? ', ' : ''}` : '') +
            (days > 0 ? `${days} ${days > 1 ? 'days' : 'day'}${number > 2 ? ', ' : ''}` : '') +
            (hours > 0 ? `${!minutes && !seconds && (days || years)  ? 'and ' : ''}${hours} ${hours > 1 ? 'hours' : 'hour'}${number > 2 ? ', ' : ''}` : '') +
            (minutes > 0 ? `${!seconds ? 'and ' : ''}${minutes} ${minutes > 1 ? 'minutes' : 'minute'}${number > 2 ? ',' : ''} ` : '') +
            (seconds > 0 ? `${number > 1 ? 'and ' : ''}${seconds} ${seconds > 1 ? 'seconds' : 'second'}` : '')
        );
        return (time === '' ? '0 seconds' : time);
    }
    /**
    * Converts duration to milliseconds.
    * @param {string} duration
    * @since v2023.3.1
    */
    static durationToMillis(duration) {
        return (
          duration
            .split(':')
            .map(Number)
            .reduce((acc, curr) => curr + acc * 60) * 1000
        );
    }
    /**
     * Returns time remaining until provided date.
     * @param {Date} timeUntil
     * @since v2023.3.1
     */
    static getRemainingTime(timeUntil) {
        const seconds = Math.abs((timeUntil - new Date()));
        const time = this.timeformat(seconds);
        return time;
    }
};