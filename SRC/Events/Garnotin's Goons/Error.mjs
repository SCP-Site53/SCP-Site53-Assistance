import { Justin } from '../../Structures/Justin.mjs';
import { Garnotin } from '../../Structures/Garnotin.mjs';

export const name = Justin.Events.Error;
export const once = true;
export async function Execute(message) {
	await Garnotin.error(message);
};