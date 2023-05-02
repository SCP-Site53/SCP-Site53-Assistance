"use strict";
import { JamesDavid } from './JamesDavid.mjs';
import { get, set, unset } from 'lodash-es';

export class Oliver {
    driver;
    tableName;
    options;
    constructor(options = {}) {
        options.table ??= "json";
        options.guild ??= "932845698662162432";
        options.filePath ??= `Utilities/Database/${options.guild}.sqlite`;
        options.driver ??= new JamesDavid(options.filePath);
        this.options = options;
        this.driver = options.driver;
        this.tableName = options.table;
        this.driver.prepare(this.tableName);
    }
    async addSubtract(key, value, sub = false) {
        if (typeof key != "string") 
            throw new Error("Oliver's first argument (key) needs to be a string.");
        if (value == null) 
            throw new Error("Oliver is missing second argument (value).");
        let currentNumber = await this.get(key);
        if (currentNumber == null) currentNumber = 0;
        if (typeof currentNumber != "number") {
            try {
                currentNumber = parseFloat(currentNumber);
            }
            catch (_) {
                throw new Error(`Oliver's current value with key: (${key}) is not a number and couldn't be parsed to a number.`);
            };
        };
        sub ? (currentNumber -= value) : (currentNumber += value);
        return this.set(key, currentNumber);
    }
    async getArray(key) {
        const currentArr = (await this.get(key)) ?? [];
        if (!Array.isArray(currentArr)) 
            throw new Error(`Oliver's current value with key: (${key}) is not an array.`);
        return currentArr;
    }
    async all() {
        return this.driver.getAllRows(this.tableName);
    }
    async get(key) {
        if (typeof key != "string") 
            throw new Error("Oliver's first argument (key) needs to be a string.");
        if (key.includes(".")) {
            const keySplit = key.split(".");
            const [result] = await this.driver.getRowByKey(this.tableName, keySplit[0]);
            return (0, get)(result, keySplit.slice(1).join("."));
        }
        const [result] = await this.driver.getRowByKey(this.tableName, key);
        return result;
    }
    async set(key, value) {
        if (typeof key != "string") 
            throw new Error("Oliver's first argument (key) needs to be a string.");
        if (value == null) 
            throw new Error("Oliver is missing second argument (value).");
        if (key.includes(".")) {
            const keySplit = key.split(".");
            const [result, exist] = await this.driver.getRowByKey(this.tableName, keySplit[0]);
            let obj;
            if (result instanceof Object == false) {
                obj = {};
            }
            else {
                obj = result;
            }
            const valueSet = (0, set)(obj ?? {}, keySplit.slice(1).join("."), value);
            return this.driver.setRowByKey(this.tableName, keySplit[0], valueSet, exist);
        }
        const exist = (await this.driver.getRowByKey(this.tableName, key))[1];
        return this.driver.setRowByKey(this.tableName, key, value, exist);
    }
    async has(key) {
        return (await this.get(key)) != null;
    }
    async delete(key) {
        if (typeof key != "string") 
            throw new Error("Oliver's first argument (key) needs to be a string.");
        if (key.includes(".")) {
            const keySplit = key.split(".");
            const obj = (await this.get(keySplit[0])) ?? {};
            (0, unset)(obj, keySplit.slice(1).join("."));
            return this.set(keySplit[0], obj);
        }
        return this.driver.deleteRowByKey(this.tableName, key);
    }
    async deleteAll() {
        return this.driver.deleteAllRows(this.tableName);
    }
    async add(key, value) {
        return this.addSubtract(key, value);
    }
    async sub(key, value) {
        return this.addSubtract(key, value, true);
    }
    async push(key, value) {
        if (typeof key != "string") 
            throw new Error("Oliver's first argument (key) needs to be a string.");
        if (value == null) 
            throw new Error("Oliver is missing second argument (value).");
        let currentArr = await this.getArray(key);
        if (Array.isArray(value)) 
            currentArr = currentArr.concat(value);
        else 
            currentArr.push(value);
        return this.set(key, currentArr);
    }
    async pull(key, value) {
        if (typeof key != "string") 
            throw new Error("Oliver's first argument (key) needs to be a string.");
        if (value == null) 
            throw new Error("Oliver is missing second argument (value).");
        let currentArr = await this.getArray(key);
        if (!Array.isArray(value) && typeof value != "function") 
            value = [value];
        currentArr = currentArr.filter((...params) => Array.isArray(value)
            ? !value.includes(params[0])
            : !value(...params));
        return this.set(key, currentArr);
    }
    table(table) {
        if (typeof table != "string") 
            throw new Error("Oliver's first argument (table) needs to be a string.");
        const options = { ...this.options };
        options.table = table;
        options.driver = this.options.driver;
        return new Oliver(options);
    }
};