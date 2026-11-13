// Pages are built with the status WEAO had at the time. This asks the site's
// Worker for the current one and updates badges, status panels and the home
// page's "Right now" board in place. If it can't, the page keeps what it was
// built with.
import { STATE_LABEL, shortDate, statusPanelHtml, tally, type Status } from '../lib/weao.js';

const badges = document.querySelectorAll<HTMLElement>('[data-live-status]');
const panels = document.querySelectorAll<HTMLElement>('[data-status-panel]');
const boards = document.querySelectorAll<HTMLElement>('[data-status-board]');

function apply(statuses: Record<string, Status>) {
	for (const badge of badges) {
		const status = statuses[badge.dataset.liveStatus!];
		if (!status) continue;
		badge.dataset.state = status.state;
		badge.querySelector('[data-label]')!.textContent = STATE_LABEL[status.state];
		badge.hidden = badge.hasAttribute('data-quiet') && status.state === 'updated';
	}
	for (const panel of panels) {
		const status = statuses[panel.dataset.statusPanel!];
		if (!status) continue;
		panel.querySelector('[data-status-body]')!.innerHTML = statusPanelHtml(status, panel.dataset.name!);
		panel.hidden = false;
	}
}

function applyBoard(board: HTMLElement, statuses: Record<string, Status>, roblox: Record<string, string>) {
	const counts = tally(statuses);
	if (counts.total === 0) return;
	const max = Number(board.dataset.max);
	const shown = counts.waiting.slice(0, max);

	for (const key of ['updated', 'total'] as const) {
		board.querySelector(`[data-count="${key}"]`)!.textContent = String(counts[key]);
	}
	for (const key of ['updated', 'mixed', 'outdated'] as const) {
		const segment = board.querySelector<HTMLElement>(`[data-segment="${key}"]`)!;
		segment.style.flexGrow = String(counts[key]);
		segment.hidden = counts[key] === 0;
	}

	const list = board.querySelector<HTMLElement>('[data-rows]')!;
	for (const row of list.querySelectorAll<HTMLElement>('[data-board-row]')) {
		row.hidden = !shown.includes(row.dataset.boardRow!);
	}
	// Most urgent first, the same order the page was built in.
	for (const slug of shown) {
		const row = list.querySelector(`[data-board-row="${slug}"]`);
		if (row) list.append(row);
	}
	board.querySelector<HTMLElement>('[data-all-clear]')!.hidden = counts.waiting.length > 0;
	board.querySelector<HTMLElement>('[data-more]')!.hidden = counts.waiting.length <= max;
	board.querySelector('[data-more-count]')!.textContent = String(Math.max(0, counts.waiting.length - max));

	let anyDate = false;
	for (const item of board.querySelectorAll<HTMLElement>('[data-roblox-platform]')) {
		const date = roblox[item.dataset.robloxPlatform!];
		if (!date) continue;
		const time = item.querySelector('time')!;
		time.dateTime = date;
		time.textContent = shortDate(date);
		item.hidden = false;
		anyDate = true;
	}
	if (anyDate) board.querySelector<HTMLElement>('[data-roblox]')!.hidden = false;
	board.hidden = false;
}

if (badges.length > 0 || panels.length > 0 || boards.length > 0) {
	fetch('/api/status', { headers: { accept: 'application/json' } })
		.then((response) => (response.ok ? response.json() : undefined))
		.then((data) => {
			if (!data?.products) return;
			apply(data.products);
			for (const board of boards) applyBoard(board, data.products, data.roblox ?? {});
		})
		.catch(() => {});
}
