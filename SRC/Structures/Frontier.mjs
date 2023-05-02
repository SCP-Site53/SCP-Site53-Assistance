import { readdirSync, lstatSync } from 'node:fs';
import { join } from 'node:path';

export class Frontier {

    /**
     * Fetches all file paths in c: protocol of all directories in a given path.
     * ```js
     * import { Frontier } from 'Frontier';
     * 
     * //Fetches file paths in c: protocol.
     * const files = Frontier.recursiveReaddirSync('./directory');
     * 
     * //Logs an array of file paths in c: protocol.
     * console.log(files);
     * ```
     * `Frontier` will throw a `TypeError` if `directoryPath` is missing.
     * @param {string} directoryPath
     * @returns {Array}
     * @since v2023.3.24
     */
    static recursiveReaddirSync(directoryPath) {
        if (!directoryPath)
            throw new TypeError('Missing directory path.');
        let list = [];
        const files = readdirSync(directoryPath);
        for (const file of files) {
            const stats = lstatSync(join(directoryPath, file));
            if (stats.isDirectory()) {
                list = list.concat(Frontier.recursiveReaddirSync(join(directoryPath, file)));
            } else {
                list.push(join(path, file));
            };
        };
        return list;
    };

    /**
     * Converts c: protocol paths to file data protocol (used by import functions).
     * ```js
     * import { Frontier } from 'Frontier';
     * 
     * //Fetches file names.
     * const fileDataProtocolPath = Frontier.fromCProtocolToFileDataProtocol(cProtocolPath);
     * 
     * //Logs a file path
     * console.log(fileDataProtocolPath);
     * ```
     * `Frontier` will throw a `TypeError` if `cProtocolPath` is missing.
     * @param {string} cProtocolPath
     * @returns {string}
     * @since v2023.3.24
     */
    static fromCProtocolToFileDataProtocol(cProtocolPath) {
        if (!cProtocolPath)
            throw new TypeError('Missing c: protocol path.');
        return `file:///C|/${cProtocolPath.split('\\').slice(1).join('/')}`;
    };

    /**
     * Converts file data protocol paths to c: protocol.
     * ```js
     * import { Frontier } from 'Frontier';
     * 
     * //Converts to c: prococol.
     * const cProtocolPath = Frontier.fromFileDataProtocolToCProtocol(fileDataProtocolPath);
     * 
     * //Logs the c: protocol path.
     * console.log(cProtocolPath);
     * ```
     * `Frontier` will throw a `TypeError` if `fileDataProtocolPath` is missing.
     * @param {string} fileDataProtocolPath
     * @returns {string}
     * @since v2023.3.24
     */
    static fromFileDataProtocolToCProtocol(fileDataProtocolPath) {
        if (!fileDataProtocolPath)
            throw new TypeError('Missing file data path.');
        return `c:\\${fileDataProtocolPath.split('/').slice(1).join('\\')}`;
    };

    /**
     * 
     * @param {string} path 
     * @returns {string}
     * @deprecated
     * @since v2023.3.23
     */
    static toImportFormat(path) {
        return this.fromCProtocolToFileDataProtocol(path);
    };

        /**
     * Fetches all file paths in c: protocol of all directories in a given path.
     * ```js
     * import { Frontier } from 'Frontier';
     * 
     * //Fetches file paths in c: protocol.
     * const files = Frontier.recursiveReaddirSync('./directory');
     * 
     * //Logs an array of file paths in c: protocol.
     * console.log(files);
     * ```
     * `Frontier` will throw a `TypeError` if `directoryPath` is missing.
     * @param {string} directoryPath
     * @returns {Array}
     * @since v2023.3.24
     */
    static recursiveReaddirSync(directoryPath) {
        if (!directoryPath) {
            if (this.path.startsWith('c:')) 
                directoryPath = this.path;
            else 
                throw new TypeError('Missing directory path.');
        };
        this.list = [];
        const files = readdirSync(directoryPath);
        for (const file of files) {
            const stats = lstatSync(join(directoryPath, file));
            if (stats.isDirectory()) {
                this.list = this.list.concat(Frontier.recursiveReaddirSync(join(directoryPath, file)));
            } else {
                this.list.push(join(directoryPath, file));
            };
        };
        return this.list;
    };
    
    /**
     * Converts c: protocol paths to file data protocol (used by import functions).
     * ```js
     * import { Frontier } from 'Frontier';
     * 
     * //Fetches file names.
     * const fileDataProtocolPath = Frontier.fromCProtocolToFileDataProtocol(cProtocolPath);
     * 
     * //Logs a file path
     * console.log(fileDataProtocolPath);
     * ```
     * @param {string} cProtocolPath
     * @returns {string}
     * @since v2023.3.24
     */
    
    fromCProtocolToFileDataProtocol(cProtocolPath) {
        if (!cProtocolPath) {
            if (this.path) {
                this.path = `file:///C|/${this.path.split('\\').slice(1).join('/')}`;
                return this.path;
            }
            else if (!this.list) {
                let newList = [];
                for (const file of this.list) {
                    newList.push(`file:///C|/${file.split('\\').slice(1).join('/')}`);
                };
                this.list = newList;
                return this.list;
            }
            else {
                throw new TypeError('Missing c: protocol path.');
            };
        };
        return `file:///C|/${cProtocolPath.split('\\').slice(1).join('/')}`;;
    };

    /**
     * Converts file data protocol paths to c: protocol.
     * ```js
     * import { Frontier } from 'Frontier';
     * 
     * //Converts to c: prococol.
     * const cProtocolPath = Frontier.fromFileDataProtocolToCProtocol(fileDataProtocolPath);
     * 
     * //Logs the c: protocol path.
     * console.log(cProtocolPath);
     * ```
     * `Frontier` will throw a `TypeError` if `fileDataProtocolPath` is missing.
     * @param {string} fileDataProtocolPath
     * @returns {string}
     * @since v2023.3.24
     */
    fromFileDataProtocolToCProtocol(fileDataProtocolPath) {
        if (!fileDataProtocolPath) {
            if (this.path) {
                this.path = `c:\\${this.path.split('/').slice(1).join('\\')}`;
                return this.path;
            }
            else if (!this.list) {
                let newList = [];
                for (const file of this.list) {
                    newList.push(`c:\\${file.split('/').slice(1).join('\\')}`);
                };
                this.list = newList;
                return this.list;
            }
            else {
                throw new TypeError('Missing file data path.');
            };
        };
        return `c:\\${fileDataProtocolPath.split('/').slice(1).join('\\')}`;
    };
};