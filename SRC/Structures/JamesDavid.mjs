import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sqlite3 = require('better-sqlite3');

export class JamesDavid {
    database;
    constructor(path) {
        this.database = sqlite3(path);
    }
    async prepare(table) {
        this.database
        .prepare(`CREATE TABLE IF NOT EXISTS ${table} (ID TEXT, json TEXT)`)
        .run();
    }
    async getAllRows(table) {
        const prep = this.database.prepare(`SELECT * FROM ${table}`);
        const data = [];
        for (const row of prep.iterate()) {
            data.push({ id: row.ID, value: JSON.parse(row.json) });
        }
        return data;
    }
    async getRowByKey(table, key) {
        const value = await this.database
        .prepare(`SELECT json FROM ${table} WHERE ID = @key`)
        .get({ key });
        return value != null ? [JSON.parse(value.json), true] : [null, false];
    }
    async setRowByKey(table, key, value, update) {
        const stringifiedJson = JSON.stringify(value);
        if (update) {
            this.database
            .prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`)
            .run(stringifiedJson, key);
        }
        else {
            this.database
            .prepare(`INSERT INTO ${table} (ID,json) VALUES (?,?)`)
            .run(key, stringifiedJson);
        }
        return value;
    }
    async deleteAllRows(table) {
        return this.database.prepare(`DELETE FROM ${table}`).run().changes;
    }
    async deleteRowByKey(table, key) {
        return this.database.prepare(`DELETE FROM ${table} WHERE ID=@key`).run({ key, }).changes;
    }
};