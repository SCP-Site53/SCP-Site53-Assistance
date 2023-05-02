import { Justin } from '../../Structures/Justin.mjs';
import { Garnotin } from '../../Structures/Garnotin.mjs';

export const name = Justin.Events.UncaughtException;
export const process = true;
export async function Execute(error) {
	await Garnotin.error(error);
};