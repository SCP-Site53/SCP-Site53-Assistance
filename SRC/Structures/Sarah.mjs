import { existsSync, access } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';
import { promisify } from 'node:util';

const require = createRequire(import.meta.url);
let defaultAddon;
const descriptor = { value: 'SarahError', writable: true, enumerable: false, configurable: true };
function getBooleanOption(options, key) {
	let value = false;
	if (key in options && typeof (value = options[key]) !== 'boolean') {
		throw new TypeError(`Expected the "${key}" option to be a boolean`);
	}
	return value;
}
const cppdb = Symbol();
const inspect = Symbol.for('nodejs.util.inspect.custom');
const controllers = new WeakMap();
const fsAccess = promisify(access);

export class SarahError {
	constructor(message, code) {
		if (new.target !== SarahError) 
			return this(message, code);
		if (typeof code !== 'string') 
			throw new TypeError('Expected second argument to be a string');
		Error.call(this, message);
		descriptor.value = '' + message;
		Object.defineProperty(this, 'message', descriptor);
		Error.captureStackTrace(this, SarahError);
		this.code = code;
	}
};

Object.setPrototypeOf(SarahError, Error);
Object.setPrototypeOf(SarahError.prototype, Error.prototype);
Object.defineProperty(SarahError.prototype, 'name', descriptor);

export class Sarah {
	constructor(filenameGiven, options) {
		if (new.target == null) {
			return new Sarah(filenameGiven, options);
		}

		// Apply defaults
		let buffer;
		if (Buffer.isBuffer(filenameGiven)) {
			buffer = filenameGiven;
			filenameGiven = ':memory:';
		}
		if (filenameGiven == null)
			filenameGiven = '';
		if (options == null)
			options = {};

		// Validate arguments
		if (typeof filenameGiven !== 'string')
			throw new TypeError('Expected first argument to be a string');
		if (typeof options !== 'object')
			throw new TypeError('Expected second argument to be an options object');
		if ('readOnly' in options)
			throw new TypeError('Misspelled option "readOnly" should be "readonly"');
		if ('memory' in options)
			throw new TypeError('Option "memory" was removed in v7.0.0 (use ":memory:" filename instead)');

		// Interpret options
		const filename = filenameGiven.trim();
		const anonymous = filename === '' || filename === ':memory:';
		const readonly = getBooleanOption(options, 'readonly');
		const fileMustExist = getBooleanOption(options, 'fileMustExist');
		const timeout = 'timeout' in options ? options.timeout : 5000;
		const verbose = 'verbose' in options ? options.verbose : null;
		const nativeBindingPath = 'nativeBinding' in options ? options.nativeBinding : null;

		// Validate interpreted options
		if (readonly && anonymous && !buffer)
			throw new TypeError('In-memory/temporary databases cannot be readonly');
		if (!Number.isInteger(timeout) || timeout < 0)
			throw new TypeError('Expected the "timeout" option to be a positive integer');
		if (timeout > 0x7fffffff)
			throw new RangeError('Option "timeout" cannot be greater than 2147483647');
		if (verbose != null && typeof verbose !== 'function')
			throw new TypeError('Expected the "verbose" option to be a function');
		if (nativeBindingPath != null && typeof nativeBindingPath !== 'string')
			throw new TypeError('Expected the "nativeBinding" option to be a string');

		// Load the native addon
		let addon;
		if (nativeBindingPath == null) {
			addon = defaultAddon || (defaultAddon = require('bindings')('better_sqlite3.node'));
		} else {
			addon = require(resolve(nativeBindingPath).replace(/(\.node)?$/, '.node'));
		}
		if (!addon.isInitialized) {
			addon.setErrorConstructor(SarahError);
			addon.isInitialized = true;
		}

		// Make sure the specified directory exists
		if (!anonymous && !existsSync(dirname(filename))) {
			throw new TypeError('Cannot open database because the directory does not exist');
		}

		Object.defineProperties(this, {
			[cppdb]: { value: new addon.Database(filename, filenameGiven, anonymous, readonly, fileMustExist, timeout, verbose || null, buffer || null) },
			...{
                name: {
                    get: function name() { return this[cppdb].name; },
                    enumerable: true,
                },
                open: {
                    get: function open() { return this[cppdb].open; },
                    enumerable: true,
                },
                inTransaction: {
                    get: function inTransaction() { return this[cppdb].inTransaction; },
                    enumerable: true,
                },
                readonly: {
                    get: function readonly() { return this[cppdb].readonly; },
                    enumerable: true,
                },
                memory: {
                    get: function memory() { return this[cppdb].memory; },
                    enumerable: true,
                },
            },
		});
	};

    prepare(sql) {
        return this[cppdb].prepare(sql, this, false);
    }
    
    exec(sql) {
        this[cppdb].exec(sql);
        return this;
    }
    
    close() {
        this[cppdb].close();
        return this;
    }
    
    loadExtension(...args) {
        this[cppdb].loadExtension(...args);
        return this;
    }
    
    defaultSafeIntegers(...args) {
        this[cppdb].defaultSafeIntegers(...args);
        return this;
    }
    
    unsafeMode(...args) {
        this[cppdb].unsafeMode(...args);
        return this;
    }

	transaction(fn) {
        if (typeof fn !== 'function') throw new TypeError('Expected first argument to be a function');
    
        // Return the database's cached transaction controller, or create a new one
        const getController = (db, self) => {
            let controller = controllers.get(db);
            if (!controller) {
                const shared = {
                    commit: db.prepare('COMMIT', self, false),
                    rollback: db.prepare('ROLLBACK', self, false),
                    savepoint: db.prepare('SAVEPOINT `\t_bs3.\t`', self, false),
                    release: db.prepare('RELEASE `\t_bs3.\t`', self, false),
                    rollbackTo: db.prepare('ROLLBACK TO `\t_bs3.\t`', self, false),
                };
                controllers.set(db, controller = {
                    default: Object.assign({ begin: db.prepare('BEGIN', self, false) }, shared),
                    deferred: Object.assign({ begin: db.prepare('BEGIN DEFERRED', self, false) }, shared),
                    immediate: Object.assign({ begin: db.prepare('BEGIN IMMEDIATE', self, false) }, shared),
                    exclusive: Object.assign({ begin: db.prepare('BEGIN EXCLUSIVE', self, false) }, shared),
                });
            }
            return controller;
        };
        
        // Return a new transaction function by wrapping the given function
        const wrapTransaction = (apply, fn, db, { begin, commit, rollback, savepoint, release, rollbackTo }) => function sqliteTransaction() {
            let before, after, undo;
            if (db.inTransaction) {
                before = savepoint;
                after = release;
                undo = rollbackTo;
            } else {
                before = begin;
                after = commit;
                undo = rollback;
            }
            before.run();
            try {
                const result = apply.call(fn, this, arguments);
                after.run();
                return result;
            } catch (ex) {
                if (db.inTransaction) {
                    undo.run();
                    if (undo !== rollback) after.run();
                }
                throw ex;
            }
        };
    
        const db = this[cppdb];
        const controller = getController(db, this);
        const { apply } = Function.prototype;
    
        // Each version of the transaction function has these same properties
        const properties = {
            default: { value: wrapTransaction(apply, fn, db, controller.default) },
            deferred: { value: wrapTransaction(apply, fn, db, controller.deferred) },
            immediate: { value: wrapTransaction(apply, fn, db, controller.immediate) },
            exclusive: { value: wrapTransaction(apply, fn, db, controller.exclusive) },
            database: { value: this, enumerable: true },
        };
    
        Object.defineProperties(properties.default.value, properties);
        Object.defineProperties(properties.deferred.value, properties);
        Object.defineProperties(properties.immediate.value, properties);
        Object.defineProperties(properties.exclusive.value, properties);
    
        // Return the default version of the transaction function
        return properties.default.value;
    };
    
	pragma(source, options) {
        if (options == null) options = {};
        if (typeof source !== 'string') throw new TypeError('Expected first argument to be a string');
        if (typeof options !== 'object') throw new TypeError('Expected second argument to be an options object');
        const simple = getBooleanOption(options, 'simple');
    
        const stmt = this[cppdb].prepare(`PRAGMA ${source}`, this, true);
        return simple ? stmt.pluck().get() : stmt.all();
    };

	async backup(filename, options) {

        function runBackup(backup, handler) {
            let rate = 0;
            let useDefault = true;
        
            return new Promise((resolve, reject) => {
                setImmediate(step => {
                    try {
                        const progress = backup.transfer(rate);
                        if (!progress.remainingPages) {
                            backup.close();
                            resolve(progress);
                            return;
                        }
                        if (useDefault) {
                            useDefault = false;
                            rate = 100;
                        }
                        if (handler) {
                            const ret = handler(progress);
                            if (ret !== undefined) {
                                if (typeof ret === 'number' && ret === ret) rate = Math.max(0, Math.min(0x7fffffff, Math.round(ret)));
                                else throw new TypeError('Expected progress callback to return a number or undefined');
                            }
                        }
                        setImmediate(step);
                    } catch (err) {
                        backup.close();
                        reject(err);
                    }
                });
            });
        };
    
        if (options == null) options = {};
    
        // Validate arguments
        if (typeof filename !== 'string') throw new TypeError('Expected first argument to be a string');
        if (typeof options !== 'object') throw new TypeError('Expected second argument to be an options object');
    
        // Interpret options
        filename = filename.trim();
        const attachedName = 'attached' in options ? options.attached : 'main';
        const handler = 'progress' in options ? options.progress : null;
    
        // Validate interpreted options
        if (!filename) throw new TypeError('Backup filename cannot be an empty string');
        if (filename === ':memory:') throw new TypeError('Invalid backup filename ":memory:"');
        if (typeof attachedName !== 'string') throw new TypeError('Expected the "attached" option to be a string');
        if (!attachedName) throw new TypeError('The "attached" option cannot be an empty string');
        if (handler != null && typeof handler !== 'function') throw new TypeError('Expected the "progress" option to be a function');
    
        // Make sure the specified directory exists
        await fsAccess(dirname(filename)).catch(() => {
            throw new TypeError('Cannot save backup because the directory does not exist');
        });
    
        const isNewFile = await fsAccess(filename).then(() => false, () => true);
        return runBackup(this[cppdb].backup(this, attachedName, filename, isNewFile), handler || null);
    };

	serialize(options) {
        if (options == null) options = {};
    
        // Validate arguments
        if (typeof options !== 'object') throw new TypeError('Expected first argument to be an options object');
    
        // Interpret and validate options
        const attachedName = 'attached' in options ? options.attached : 'main';
        if (typeof attachedName !== 'string') throw new TypeError('Expected the "attached" option to be a string');
        if (!attachedName) throw new TypeError('The "attached" option cannot be an empty string');
    
        return this[cppdb].serialize(attachedName);
    };

	function(name, options, fn) {
        // Apply defaults
        if (options == null) options = {};
        if (typeof options === 'function') { fn = options; options = {}; }
    
        // Validate arguments
        if (typeof name !== 'string') throw new TypeError('Expected first argument to be a string');
        if (typeof fn !== 'function') throw new TypeError('Expected last argument to be a function');
        if (typeof options !== 'object') throw new TypeError('Expected second argument to be an options object');
        if (!name) throw new TypeError('User-defined function name cannot be an empty string');
    
        // Interpret options
        const safeIntegers = 'safeIntegers' in options ? +getBooleanOption(options, 'safeIntegers') : 2;
        const deterministic = getBooleanOption(options, 'deterministic');
        const directOnly = getBooleanOption(options, 'directOnly');
        const varargs = getBooleanOption(options, 'varargs');
        let argCount = -1;
    
        // Determine argument count
        if (!varargs) {
            argCount = fn.length;
            if (!Number.isInteger(argCount) || argCount < 0) throw new TypeError('Expected function.length to be a positive integer');
            if (argCount > 100) throw new RangeError('User-defined functions cannot have more than 100 arguments');
        }
    
        this[cppdb].function(fn, name, argCount, safeIntegers, deterministic, directOnly);
        return this;
    };

	aggregate(name, options) {

        function getFunctionOption(options, key, required) {
            const value = key in options ? options[key] : null;
            if (typeof value === 'function') return value;
            if (value != null) throw new TypeError(`Expected the "${key}" option to be a function`);
            if (required) throw new TypeError(`Missing required option "${key}"`);
            return null;
        };

        function getLength({ length }) {
            if (Number.isInteger(length) && length >= 0) return length;
            throw new TypeError('Expected function.length to be a positive integer');
        };
    
        // Validate arguments
        if (typeof name !== 'string') throw new TypeError('Expected first argument to be a string');
        if (typeof options !== 'object' || options === null) throw new TypeError('Expected second argument to be an options object');
        if (!name) throw new TypeError('User-defined function name cannot be an empty string');
    
        // Interpret options
        const start = 'start' in options ? options.start : null;
        const step = getFunctionOption(options, 'step', true);
        const inverse = getFunctionOption(options, 'inverse', false);
        const result = getFunctionOption(options, 'result', false);
        const safeIntegers = 'safeIntegers' in options ? +getBooleanOption(options, 'safeIntegers') : 2;
        const deterministic = getBooleanOption(options, 'deterministic');
        const directOnly = getBooleanOption(options, 'directOnly');
        const varargs = getBooleanOption(options, 'varargs');
        let argCount = -1;
    
        // Determine argument count
        if (!varargs) {
            argCount = Math.max(getLength(step), inverse ? getLength(inverse) : 0);
            if (argCount > 0) argCount -= 1;
            if (argCount > 100) throw new RangeError('User-defined functions cannot have more than 100 arguments');
        }
    
        this[cppdb].aggregate(start, step, inverse, result, name, argCount, safeIntegers, deterministic, directOnly);
        return this;
    }

	table(name, factory) {

        function wrapFactory(factory) {
            return function virtualTableFactory(moduleName, databaseName, tableName, ...args) {
                const thisObject = {
                    module: moduleName,
                    database: databaseName,
                    table: tableName,
                };
        
                // Generate a new table definition by invoking the factory
                const def = apply.call(factory, thisObject, args);
                if (typeof def !== 'object' || def === null) {
                    throw new TypeError(`Virtual table module "${moduleName}" did not return a table definition object`);
                }
        
                return parseTableDefinition(def, 'returned', moduleName);
            };
        }
        
        function parseTableDefinition(def, verb, moduleName) {
            // Validate required properties
            if (!hasOwnProperty.call(def, 'rows')) {
                throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition without a "rows" property`);
            }
            if (!hasOwnProperty.call(def, 'columns')) {
                throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition without a "columns" property`);
            }
        
            // Validate "rows" property
            const rows = def.rows;
            if (typeof rows !== 'function' || Object.getPrototypeOf(rows) !== GeneratorFunctionPrototype) {
                throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "rows" property (should be a generator function)`);
            }
        
            // Validate "columns" property
            let columns = def.columns;
            if (!Array.isArray(columns) || !(columns = [...columns]).every(x => typeof x === 'string')) {
                throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "columns" property (should be an array of strings)`);
            }
            if (columns.length !== new Set(columns).size) {
                throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with duplicate column names`);
            }
            if (!columns.length) {
                throw new RangeError(`Virtual table module "${moduleName}" ${verb} a table definition with zero columns`);
            }
        
            // Validate "parameters" property
            let parameters;
            if (hasOwnProperty.call(def, 'parameters')) {
                parameters = def.parameters;
                if (!Array.isArray(parameters) || !(parameters = [...parameters]).every(x => typeof x === 'string')) {
                    throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "parameters" property (should be an array of strings)`);
                }
            } else {
                parameters = inferParameters(rows);
            }
            if (parameters.length !== new Set(parameters).size) {
                throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with duplicate parameter names`);
            }
            if (parameters.length > 32) {
                throw new RangeError(`Virtual table module "${moduleName}" ${verb} a table definition with more than the maximum number of 32 parameters`);
            }
            for (const parameter of parameters) {
                if (columns.includes(parameter)) {
                    throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with column "${parameter}" which was ambiguously defined as both a column and parameter`);
                }
            }
        
            // Validate "safeIntegers" option
            let safeIntegers = 2;
            if (hasOwnProperty.call(def, 'safeIntegers')) {
                const bool = def.safeIntegers;
                if (typeof bool !== 'boolean') {
                    throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "safeIntegers" property (should be a boolean)`);
                }
                safeIntegers = +bool;
            }
        
            // Validate "directOnly" option
            let directOnly = false;
            if (hasOwnProperty.call(def, 'directOnly')) {
                directOnly = def.directOnly;
                if (typeof directOnly !== 'boolean') {
                    throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "directOnly" property (should be a boolean)`);
                }
            }
        
            // Generate SQL for the virtual table definition
            const columnDefinitions = [
                ...parameters.map(identifier).map(str => `${str} HIDDEN`),
                ...columns.map(identifier),
            ];
            return [
                `CREATE TABLE x(${columnDefinitions.join(', ')});`,
                wrapGenerator(rows, new Map(columns.map((x, i) => [x, parameters.length + i])), moduleName),
                parameters,
                safeIntegers,
                directOnly,
            ];
        }
        
        function wrapGenerator(generator, columnMap, moduleName) {
            return function* virtualTable(...args) {
                /*
                    We must defensively clone any buffers in the arguments, because
                    otherwise the generator could mutate one of them, which would cause
                    us to return incorrect values for hidden columns, potentially
                    corrupting the database.
                 */
                const output = args.map(x => Buffer.isBuffer(x) ? Buffer.from(x) : x);
                for (let i = 0; i < columnMap.size; ++i) {
                    output.push(null); // Fill with nulls to prevent gaps in array (v8 optimization)
                }
                for (const row of generator(...args)) {
                    if (Array.isArray(row)) {
                        extractRowArray(row, output, columnMap.size, moduleName);
                        yield output;
                    } else if (typeof row === 'object' && row !== null) {
                        extractRowObject(row, output, columnMap, moduleName);
                        yield output;
                    } else {
                        throw new TypeError(`Virtual table module "${moduleName}" yielded something that isn't a valid row object`);
                    }
                }
            };
        }
        
        function extractRowArray(row, output, columnCount, moduleName) {
            if (row.length !== columnCount) {
                throw new TypeError(`Virtual table module "${moduleName}" yielded a row with an incorrect number of columns`);
            }
            const offset = output.length - columnCount;
            for (let i = 0; i < columnCount; ++i) {
                output[i + offset] = row[i];
            }
        }
        
        function extractRowObject(row, output, columnMap, moduleName) {
            let count = 0;
            for (const key of Object.keys(row)) {
                const index = columnMap.get(key);
                if (index === undefined) {
                    throw new TypeError(`Virtual table module "${moduleName}" yielded a row with an undeclared column "${key}"`);
                }
                output[index] = row[key];
                count += 1;
            }
            if (count !== columnMap.size) {
                throw new TypeError(`Virtual table module "${moduleName}" yielded a row with missing columns`);
            }
        }
        
        function inferParameters({ length }) {
            if (!Number.isInteger(length) || length < 0) {
                throw new TypeError('Expected function.length to be a positive integer');
            }
            const params = [];
            for (let i = 0; i < length; ++i) {
                params.push(`$${i + 1}`);
            }
            return params;
        }
        
        const { hasOwnProperty } = Object.prototype;
        const { apply } = Function.prototype;
        const GeneratorFunctionPrototype = Object.getPrototypeOf(function*(){});
        const identifier = str => `"${str.replace(/"/g, '""')}"`;
        const defer = x => () => x;
        
        // Validate arguments
        if (typeof name !== 'string') throw new TypeError('Expected first argument to be a string');
        if (!name) throw new TypeError('Virtual table module name cannot be an empty string');
    
        // Determine whether the module is eponymous-only or not
        let eponymous = false;
        if (typeof factory === 'object' && factory !== null) {
            eponymous = true;
            factory = defer(parseTableDefinition(factory, 'used', name));
        } else {
            if (typeof factory !== 'function') throw new TypeError('Expected second argument to be a function or a table definition object');
            factory = wrapFactory(factory);
        }
    
        this[cppdb].table(factory, name, eponymous);
        return this;
    };

	[inspect](_depth, _opts) {
        const DatabaseInspection = function Database() {};
        return Object.assign(new DatabaseInspection(), this);
    };
};