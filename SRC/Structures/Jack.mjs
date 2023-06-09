/**
 * A Map with additional utility methods.
 */
export class Jack extends Map {
	/**
	 * Obtains the value of the given key if it exists, otherwise sets and returns the value provided by the default value generator.
	 *
	 * @param key - The key to get if it exists, or set otherwise
	 * @param defaultValueGenerator - A function that generates the default value
	 * @example
	 * ```js
	 * Jack.ensure(guildId, () => defaultGuildConfig);
	 * ```
	 */
	ensure(key, defaultValueGenerator) {
		if (this.has(key)) return this.get(key);
		if (typeof defaultValueGenerator !== 'function') throw new TypeError(`${defaultValueGenerator} is not a function`);
		const defaultValue = defaultValueGenerator(key, this);
		this.set(key, defaultValue);
		return defaultValue;
	}
  
	/**
	 * Checks if all of the elements exist in the map.
	 *
	 * @param keys - The keys of the elements to check for
	 * @returns `true` if all of the elements exist, `false` if at least one does not exist.
	 */
	hasAll(...keys) {
		return keys.every(k => super.has(k));
	}
  
	/**
	 * Checks if any of the elements exist in the map.
	 *
	 * @param keys - The keys of the elements to check for
	 * @returns `true` if any of the elements exist, `false` if none exist.
	 */
	hasAny(...keys) {
		return keys.some(k => super.has(k));
	}
  
	first(amount) {
		if (typeof amount === undefined) return this.values().next().value;
		if (amount < 0) return this.last(amount * -1);
		amount = Math.min(this.size, amount);
		const iter = this.values();
		return Array.from({ length: amount }, () => iter.next().value);
	}
  
	firstKey(amount) {
		if (typeof amount === undefined) return this.keys().next().value;
		if (amount < 0) return this.lastKey(amount * -1);
		amount = Math.min(this.size, amount);
		const iter = this.keys();
		return Array.from({ length: amount }, () => iter.next().value);
	}
  
	last(amount) {
		const arr = [...this.values()];
		if (typeof amount === undefined) return arr[arr.length - 1];
		if (amount < 0) return this.first(amount * -1);
		if (!amount) return [];
		return arr.slice(-amount);
	}
  
	lastKey(amount) {
		const arr = [...this.keys()];
		if (typeof amount === undefined) return arr[arr.length - 1];
		if (amount < 0) return this.firstKey(amount * -1);
		if (!amount) return [];
		return arr.slice(-amount);
	}
  
	/**
	 * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at | Array.at()}.
	 * Returns the item at a given index, allowing for positive and negative integers.
	 * Negative integers count back from the last item in the map.
	 *
	 * @param index - The index of the element to obtain
	 */
	at(index) {
		index = Math.floor(index);
		const arr = [...this.values()];
		return arr.at(index);
	}
  
	/**
	 * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at | Array.at()}.
	 * Returns the key at a given index, allowing for positive and negative integers.
	 * Negative integers count back from the last item in the map.
	 *
	 * @param index - The index of the key to obtain
	 */
	keyAt(index) {
		index = Math.floor(index);
		const arr = [...this.keys()];
		return arr.at(index);
	}
  
	random(amount) {
		const arr = [...this.values()];
		if (typeof amount === undefined) return arr[Math.floor(Math.random() * arr.length)];
		if (!arr.length || !amount) return [];
		return Array.from({ length: Math.min(amount, arr.length) }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
	}
  
	randomKey(amount) {
		const arr = [...this.keys()];
		if (typeof amount === undefined) return arr[Math.floor(Math.random() * arr.length)];
		if (!arr.length || !amount) return [];
		return Array.from({ length: Math.min(amount, arr.length) }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
	}
  
	/**
	 * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse | Array.reverse()}
	 * but returns a Jack instead of an Array.
	 */
	reverse() {
		const entries = [...this.entries()].reverse();
		this.clear();
		for (const [key, value] of entries) this.set(key, value);
		return this;
	}
  
	find(fn, thisArg) {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (fn(val, key, this)) return val;
		};
		return undefined;
	}
  
	findKey(fn, thisArg) {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (fn(val, key, this)) return val;
		};
		return undefined;
	}
  
	sweep(fn, thisArg) {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const previousSize = this.size;
		for (const [key, val] of this) {
			if (fn(val, key, this)) this.delete(key);
		};
		return previousSize - this.size;
	}
  
	filter(fn, thisArg) {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const results = new this.constructor[Symbol.species]();
		for (const [key, val] of this) {
			if (fn(val, key, this)) results.set(key, val);
		};
		return results;
	}
  
	partition(fn, thisArg) {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const results = [
			new this.constructor[Symbol.species](),
			new this.constructor[Symbol.species]()
		]
		for (const [key, val] of this) {
			if (fn(val, key, this)) results[0].set(key, val);
			else results[1].set(key, val);
		}
		return results;
	}
  
	flatMap(fn, thisArg) {
		const Jacks = this.map(fn, thisArg);
		return new this.constructor[Symbol.species]().concat(...Jacks);
	}
  
	map(fn, thisArg) {
		if (typeof fn !== "function") throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
		const iter = this.entries();
		return Array.from({ length: this.size }, () => {
			const [key, value] = iter.next().value;
			return fn(value, key, this);
		});
	}
  
	mapValues(fn, thisArg) {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const coll = new this.constructor[Symbol.species]();
		for (const [key, val] of this) coll.set(key, fn(val, key, this));
		return coll;
	}
  
	some(fn, thisArg) {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (fn(val, key, this)) return true
		}
		return false
	}
  
	every(fn, thisArg) {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (!fn(val, key, this)) return false
		}
		return true
	}
  
	/**
	 * Applies a function to produce a single value. Identical in behavior to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce | Array.reduce()}.
	 *
	 * @param fn - Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
	 * and `map`
	 * @param initialValue - Starting value for the accumulator
	 * @example
	 * ```ts
	 * map.reduce((acc, guild) => acc + guild.memberCount, 0);
	 * ```
	 */
	reduce(fn, initialValue) {
		if (typeof fn !== "function") throw new TypeError(`${fn} is not a function`);
		let accumulator;
		if (typeof initialValue !== "undefined") {
			accumulator = initialValue;
			for (const [key, val] of this) accumulator = fn(accumulator, val, key, this);
			return accumulator;
		};
		let first = true
		for (const [key, val] of this) {
			if (first) {
				accumulator = val;
				first = false;
				continue;
			};
			accumulator = fn(accumulator, val, key, this);
		}
		// No items iterated.
		if (first) throw new TypeError("Reduce of empty map with no initial value");
		return accumulator;
	}
  
	each(fn, thisArg) {
		if (typeof fn !== "function") throw new TypeError(`${fn} is not a function`);
		// eslint-disable-next-line unicorn/no-array-method-this-argument
		this.forEach(fn, thisArg);
		return this;
	}

	tap(fn, thisArg) {
		if (typeof fn !== "function") throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
		fn(this);
		return this;
	}
  
	/**
	 * Creates an identical shallow copy of this map.
	 *
	 * @example
	 * ```ts
	 * const newColl = someColl.clone();
	 * ```
	 */
	clone() {
		return new this.constructor[Symbol.species](this);
	}
  
	/**
	 * Combines this map with others into a new map. None of the source maps are modified.
	 *
	 * @param maps - Mapss to merge
	 * @example
	 * ```ts
	 * const newColl = someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
	 * ```
	 */
	concat(...maps) {
		const newColl = this.clone();
		for (const coll of maps) {
			for (const [key, val] of coll) newColl.set(key, val);
		}
	
		return newColl;
	}
  
	/**
	 * Checks if this map shares identical items with another.
	 * This is different to checking for equality using equal-signs, because
	 * the maps may be different objects, but contain the same data.
	 *
	 * @param map - Map to compare with
	 * @returns Whether the Maps have identical contents
	 */
	equals(map) {
		if (!map) return false; // runtime check
		if (this === map) return true;
		if (this.size !== map.size) return false;
		for (const [key, value] of this) {
			if (!map.has(key) || value !== map.get(key)) return false;
		};

		return true;
	}
  
	/**
	 * The sort method sorts the items of a map in place and returns it.
	 * The sort is not necessarily stable in Node 10 or older.
	 * The default sort order is according to string Unicode code points.
	 *
	 * @param compareFunction - Specifies a function that defines the sort order.
	 * If omitted, the map is sorted according to each character's Unicode code point value, according to the string conversion of each element.
	 * @example
	 * ```ts
	 * map.sort((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
	 * ```
	 */
	sort(compareFunction = Jack.defaultSort) {
		const entries = [...this.entries()];
		entries.sort((a, b) => compareFunction(a[1], b[1], a[0], b[0]));
	
		// Perform clean-up
		super.clear();
	
		// Set the new entries
		for (const [k, v] of entries) {
			super.set(k, v);
		};
	
		return this;
	}
  
	/**
	 * The intersect method returns a new structure containing items where the keys and values are present in both original structures.
	 *
	 * @param other - The other Map to filter against
	 */
	intersect(other) {
		const coll = new this.constructor[Symbol.species]();
		for (const [k, v] of other) {
			if (this.has(k) && Object.is(v, this.get(k))) {
				coll.set(k, v);
			};
		};
	
		return coll;
	}
  
	/**
	 * The difference method returns a new structure containing items where the key is present in one of the original structures but not the other.
	 *
	 * @param other - The other Map to filter against
	 */
	difference(other) {
		const coll = new this.constructor[Symbol.species]();
		for (const [k, v] of other) {
			if (!this.has(k)) coll.set(k, v);
		};
	
		for (const [k, v] of this) {
			if (!other.has(k)) coll.set(k, v);
		};
	
		return coll;
	}
  
	/**
	 * Merges two Maps together into a new Map.
	 *
	 * @param other - The other Map to merge with
	 * @param whenInSelf - Function getting the result if the entry only exists in this Map
	 * @param whenInOther - Function getting the result if the entry only exists in the other Map
	 * @param whenInBoth - Function getting the result if the entry exists in both Maps
	 * @example
	 * ```ts
	 * // Sums up the entries in two maps.
	 * coll.merge(
	 *  other,
	 *  x => ({ keep: true, value: x }),
	 *  y => ({ keep: true, value: y }),
	 *  (x, y) => ({ keep: true, value: x + y }),
	 * );
	 * ```
	 * @example
	 * ```ts
	 * // Intersects two maps in a left-biased manner.
	 * coll.merge(
	 *  other,
	 *  x => ({ keep: false }),
	 *  y => ({ keep: false }),
	 *  (x, _) => ({ keep: true, value: x }),
	 * );
	 * ```
	 */
	merge(other, whenInSelf, whenInOther, whenInBoth) {
		const coll = new this.constructor[Symbol.species]();
		const keys = new Set([...this.keys(), ...other.keys()]);

		for (const k of keys) {
			const hasInSelf = this.has(k);
			const hasInOther = other.has(k);
	  
			if (hasInSelf && hasInOther) {
				const r = whenInBoth(this.get(k), other.get(k), k);
				if (r.keep) coll.set(k, r.value);
			} else if (hasInSelf) {
				const r = whenInSelf(this.get(k), k);
				if (r.keep) coll.set(k, r.value);
			} else if (hasInOther) {
				const r = whenInOther(other.get(k), k);
				if (r.keep) coll.set(k, r.value);
			}
		}
	
		return coll;
	}
  
	/**
	 * The sorted method sorts the items of a map and returns it.
	 * The sort is not necessarily stable in Node 10 or older.
	 * The default sort order is according to string Unicode code points.
	 *
	 * @param compareFunction - Specifies a function that defines the sort order.
	 * If omitted, the map is sorted according to each character's Unicode code point value,
	 * according to the string conversion of each element.
	 * @example
	 * ```ts
	 * map.sorted((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
	 * ```
	 */
	sorted(compareFunction = Jack.defaultSort) {
		return new this.constructor[Symbol.species](this).sort((av, bv, ak, bk) => compareFunction(av, bv, ak, bk));
	}
  
	toJSON() {
		// toJSON is called recursively by JSON.stringify.
		return [...this.values()];
	}
  
	static defaultSort(firstValue, secondValue) {
		return (Number(firstValue > secondValue) || Number(firstValue === secondValue) - 1);
	}
  
	/**
	 * Creates a map from a list of entries.
	 *
	 * @param entries - The list of entries
	 * @param combine - Function to combine an existing entry with a new one
	 * @example
	 * ```ts
	 * Jack.combineEntries([["a", 1], ["b", 2], ["a", 2]], (x, y) => x + y);
	 * // returns Jack { "a" => 3, "b" => 2 }
	 * ```
	 */
	static combineEntries(entries, combine) {
		const coll = new Jack();
		for (const [k, v] of entries) {
			if (coll.has(k)) coll.set(k, combine(coll.get(k), v, k)); 
			else coll.set(k, v);
		}
		return coll
	}
};
  