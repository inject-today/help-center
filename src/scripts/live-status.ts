// Pages are built with the status WEAO had at the time. This asks the site's
// Worker for the current one and updates badges and status panels in place.
// If it can't, the page keeps what it was built with.
import { STATE_LABEL, statusPanelHtml, type Status } from '../lib/weao.js';

const badges = document.querySelectorAll<HTMLElement>('[data-live-status]');
const panels = document.querySelectorAll<HTMLElement>('[data-status-panel]');

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

if (badges.length > 0 || panels.length > 0) {
	fetch('/api/status', { headers: { accept: 'application/json' } })
		.then((response) => (response.ok ? response.json() : undefined))
		.then((data) => data?.products && apply(data.products))
		.catch(() => {});
}
