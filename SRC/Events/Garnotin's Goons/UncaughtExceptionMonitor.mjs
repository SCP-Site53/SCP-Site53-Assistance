import { Justin } from '../../Structures/Justin.mjs';
import { Garnotin } from '../../Structures/Garnotin.mjs';

export const name = Justin.Events.UncaughtExceptionMonitor;
export const process = true;
export async function Execute(error) {
	await Garnotin.error(error);
};