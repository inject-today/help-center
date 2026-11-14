// Product status from WEAO at build time, so pages ship with a status already
// in them. The browser then asks /api/status for anything newer, because the
// site is only rebuilt when something is merged.
import { products } from './products';
import { WEAO_API, WEAO_VERSIONS_API, robloxUpdates, summarize, type Status } from './weao.js';

export type { State, Status } from './weao.js';

let statuses: Promise<Record<string, Status>> | undefined;
let roblox: Promise<Record<string, string>> | undefined;

/** Every product's status, fetched once per build. Empty when WEAO can't be reached. */
export function getStatuses(): Promise<Record<string, Status>> {
	statuses ??= load(WEAO_API, (body) => summarize(products, body), 'status badges');
	return statuses;
}

/** When Roblox last updated on each platform, fetched once per build. Empty when WEAO can't be reached. */
export function getRobloxUpdates(): Promise<Record<string, string>> {
	roblox ??= load(WEAO_VERSIONS_API, robloxUpdates, "Roblox's update dates");
	return roblox;
}

async function load<T extends object>(url: string, read: (body: unknown) => T, what: string): Promise<T> {
	try {
		const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
		if (!response.ok) throw new Error(`WEAO answered ${response.status}`);
		return read(await response.json());
	} catch (error) {
		// Status is nice to have; a build that fails because WEAO is down isn't.
		console.warn(`[status] Building without ${what}: ${error}`);
		return {} as T;
	}
}
