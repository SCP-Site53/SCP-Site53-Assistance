export class Garnotin {
    static async info(message) {
        console.info(`Info: ${message}`);
    };
    static async debug(message) {
        console.info(`Debug: ${message}`);
    };
    static async warn(warning) {
        console.warn(warning);
    };
    static async error(error) {
        console.error(error.stack ?? error);
    };
};
