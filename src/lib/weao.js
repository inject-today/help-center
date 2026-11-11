// @ts-check
// What the site says about a product's status, worked out from WEAO's tracker
// (https://weao.gg). Shared by the build (src/lib/status.ts), the Worker that
// serves /api/status (workers/site/index.js) and the browser script that keeps
// badges current (src/scripts/live-status.ts), so all three always agree.
// Plain JavaScript, because the Worker imports it without a build step.

export const WEAO_API = 'https://weao.gg/api/status/exploits';
export const WEAO_URL = 'https://weao.gg';

/** @typedef {'updated' | 'outdated' | 'issues'} ListingState */
/** @typedef {ListingState | 'partial'} State */
/** @typedef {'banwave' | 'detected' | 'clientmods' | 'hypemu' | 'unknown'} Risk */
/**
 * One WEAO entry: a product on one platform.
 * @typedef {object} Listing
 * @property {string} platform
 * @property {ListingState} state
 * @property {string} [version]
 * @property {string} [updated] When this version came out, as an ISO date.
 * @property {Risk} [risk]
 */
/**
 * @typedef {object} Status
 * @property {State} state
 * @property {Listing[]} listings
 * @property {Risk} [risk] The most serious detection warning across its listings.
 */

/** @type {Record<State, string>} */
export const STATE_LABEL = {
	updated: 'Updated',
	outdated: 'Not updated',
	issues: 'Has issues',
	partial: 'Partly updated',
};

/** @type {Record<Risk, string>} */
export const RISK_TEXT = {
	banwave: 'It may have been caught in a recent Roblox banwave.',
	detected: "It might be detected by Roblox's anti-cheat, so accounts that use it risk a ban.",
	clientmods:
		'It gets around client-modification bans, but accounts that use it can still be caught in a banwave.',
	hypemu: "It imitates Roblox's anti-cheat, but could be detected in other ways later.",
	unknown: "Whether Roblox's anti-cheat detects it is unknown right now.",
};

// Most serious first, for products listed on more than one platform.
/** @type {Risk[]} */
const RISK_ORDER = ['banwave', 'detected', 'clientmods', 'hypemu', 'unknown'];

/**
 * WEAO dates look like "11/06/2026 at 1:24 PM UTC".
 * @param {unknown} text
 * @returns {string | undefined} An ISO date, or undefined if the format changes.
 */
export function parseWeaoDate(text) {
	const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4}) at (\d{1,2}):(\d{2}) ([AP]M) UTC$/i.exec(
		typeof text === 'string' ? text.trim() : ''
	);
	if (!match) return undefined;
	const [, month, day, year, hour, minute, half] = match;
	const hours = (Number(hour) % 12) + (half.toUpperCase() === 'PM' ? 12 : 0);
	const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), hours, Number(minute)));
	return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/**
 * Same order of precedence as WEAO's own warnings.
 * @param {Record<string, unknown>} entry
 * @returns {Risk | undefined}
 */
function riskOf(entry) {
	if (entry.possibleBanwave) return 'banwave';
	if (entry.unknown) return 'unknown';
	if (!entry.detected) return undefined;
	if (entry.hypemu) return 'hypemu';
	if (entry.clientmods) return 'clientmods';
	return 'detected';
}

/**
 * @param {Record<string, unknown>} entry
 * @returns {Listing}
 */
function toListing(entry) {
	return {
		platform: String(entry.platform ?? '').slice(0, 20),
		// WEAO shows "Issues" before anything else, then Updated or Not Updated.
		state: entry.hasIssues ? 'issues' : entry.updateStatus ? 'updated' : 'outdated',
		version: typeof entry.version === 'string' ? entry.version.slice(0, 40) : undefined,
		updated: parseWeaoDate(entry.updatedDate),
		risk: riskOf(entry),
	};
}

/**
 * @param {ListingState[]} states
 * @returns {State}
 */
function combine(states) {
	if (states.every((state) => state === states[0])) return states[0];
	if (states.includes('updated')) return 'partial';
	return states.includes('outdated') ? 'outdated' : 'issues';
}

/**
 * Each product's status, keyed by slug. Products WEAO doesn't list are left out.
 * @param {{ slug: string; weaoIds?: string[] }[]} products
 * @param {unknown} entries WEAO's response.
 * @returns {Record<string, Status>}
 */
export function summarize(products, entries) {
	/** @type {Record<string, Status>} */
	const statuses = {};
	if (!Array.isArray(entries)) return statuses;
	for (const product of products) {
		const listings = entries
			.filter((entry) => entry && product.weaoIds?.includes(entry.trackerId))
			.map(toListing);
		if (listings.length === 0) continue;
		const risks = listings.map((listing) => listing.risk);
		statuses[product.slug] = {
			state: combine(listings.map((listing) => listing.state)),
			listings,
			risk: RISK_ORDER.find((risk) => risks.includes(risk)),
		};
	}
	return statuses;
}

/** @param {string[]} items */
const joinList = (items) =>
	items.length < 3 ? items.join(' and ') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;

/**
 * The sentence that explains a status on the product's page.
 * @param {Status} status
 * @param {string} name
 */
export function statusSummary(status, name) {
	switch (status.state) {
		case 'updated':
			return `${name} is updated for the current version of Roblox.`;
		case 'outdated':
			return `${name} hasn't updated for the current version of Roblox yet, so it won't work until it does. Nothing on your device needs fixing; wait for the update.`;
		case 'issues':
			return `${name} is reported as having issues right now. Check its official Discord for news before trying fixes.`;
		case 'partial': {
			/** @param {(state: ListingState) => boolean} test */
			const platforms = (test) =>
				status.listings.filter((listing) => test(listing.state)).map((listing) => listing.platform);
			return `${name} is updated on ${joinList(platforms((s) => s === 'updated'))}, but not yet on ${joinList(platforms((s) => s !== 'updated'))}.`;
		}
	}
}

/**
 * "Version 2.6.1 · updated Nov 6", from what WEAO knows about a listing.
 * @param {Listing} listing
 */
export function versionLine(listing) {
	const parts = [];
	if (listing.version) parts.push(`Version ${listing.version.replace(/^v(?=\d)/i, '')}`);
	if (listing.updated) {
		const date = new Date(listing.updated);
		const sameYear = date.getUTCFullYear() === new Date().getUTCFullYear();
		const day = date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: sameYear ? undefined : 'numeric',
			timeZone: 'UTC',
		});
		parts.push(`updated ${day}`);
	}
	return parts.join(' · ');
}

/** @param {string} text */
const escapeHtml = (text) =>
	text.replace(
		/[&<>"']/g,
		(char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char
	);

/**
 * A status badge, the same markup StatusBadge.astro renders.
 * @param {State} state
 */
export function badgeHtml(state) {
	return `<span class="it-status" data-state="${state}"><span class="it-status-dot" aria-hidden="true"></span><span>${STATE_LABEL[state]}</span></span>`;
}

/**
 * The inside of the status panel on a product's page. Rendered at build time
 * and again in the browser when /api/status has something newer. Everything
 * from WEAO is escaped, since it's text from another site.
 * @param {Status} status
 * @param {string} name
 */
export function statusPanelHtml(status, name) {
	const single = status.listings.length === 1 ? versionLine(status.listings[0]) : '';
	const rows =
		status.listings.length > 1
			? `<ul class="status-listings" role="list">${status.listings
					.map(
						(listing) =>
							`<li><span class="status-platform">${escapeHtml(listing.platform)}</span>${badgeHtml(listing.state)}<span class="it-meta">${escapeHtml(versionLine(listing))}</span></li>`
					)
					.join('')}</ul>`
			: '';
	return [
		`<p class="status-summary">${escapeHtml(statusSummary(status, name))}</p>`,
		status.risk ? `<p class="status-risk">${escapeHtml(RISK_TEXT[status.risk])}</p>` : '',
		rows,
		`<p class="status-source it-meta">${single ? `${escapeHtml(single)} · ` : ''}Status from <a href="${WEAO_URL}" rel="noopener noreferrer nofollow" target="_blank">WEAO</a></p>`,
	].join('');
}
