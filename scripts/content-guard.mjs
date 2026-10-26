// Runs on every pull request (see .github/workflows/checks.yml).
// Usage: node scripts/content-guard.mjs <base-ref>
//
// Fails when a change:
// - comes from a non-admin and touches anything outside src/content/docs/,
// - puts anything but .md guides and images into src/content/docs/,
// - adds an image over 500 KB,
// - comes from a non-admin and uses MDX, or raw HTML that can run code.
// It also lists every external link the change adds, for the moderator.
import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync, statSync } from 'node:fs';

const base = process.argv[2] ?? 'origin/main';
const permission = process.env.AUTHOR_PERMISSION || 'none';
const isAdmin = ['admin', 'maintain'].includes(permission);
// Dependabot's weekly update PRs only touch dependency files and workflows.
const isDependabot = process.env.AUTHOR === 'dependabot[bot]';
const DEPENDABOT_FILES = /^(package(-lock)?\.json|\.github\/workflows\/[^/]+\.ya?ml)$/;

const CONTENT_DIR = 'src/content/docs/';
const MAX_IMAGE_BYTES = 500 * 1024;
const IMAGE = /\.(png|jpe?g|webp|gif|avif)$/i;
// Raw HTML in a guide that could run code, load other pages or collect data.
const UNSAFE_HTML = [
	[/<\s*(script|iframe|frame|object|embed|form|input|button|meta|link|style|base)\b/i, 'an HTML tag'],
	[/<[^>]*\son[a-z]+\s*=/i, 'an inline event handler'],
	[/(?:\]\(|<|=\s*["']?)\s*(?:javascript|vbscript|data):/i, 'a script or data URL'],
];
const OWN_LINKS = /^https?:\/\/(?:www\.)?(?:inject\.today|github\.com\/inject-today)(?:[/?#]|$)/i;

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });

const errors = [];
const links = [];
const fail = (file, message) => errors.push({ file, message });

const changes = git('diff', '--name-status', '--no-renames', `${base}...HEAD`)
	.split('\n')
	.filter(Boolean)
	.map((line) => {
		const [status, file] = line.split('\t');
		return { removed: status === 'D', file };
	});

for (const { removed, file } of changes) {
	if (!file.startsWith(CONTENT_DIR)) {
		if (!isAdmin && !(isDependabot && DEPENDABOT_FILES.test(file))) {
			fail(file, 'Only admins can change files outside src/content/docs/. A moderator will help with this part.');
		}
		continue;
	}
	if (removed) continue;

	if (IMAGE.test(file)) {
		const size = statSync(file).size;
		if (size > MAX_IMAGE_BYTES) {
			fail(file, `This image is ${Math.round(size / 1024)} KB; the limit is 500 KB. Crop it or save it as WebP.`);
		}
		continue;
	}

	if (/\.mdx$/i.test(file)) {
		if (!isAdmin) fail(file, 'Guides must be .md files. MDX can run code when the site is built, so only admins use it.');
		continue;
	}

	if (!/\.md$/i.test(file)) {
		fail(
			file,
			'Only .md guides and PNG, JPEG, WebP, GIF or AVIF images belong here. Programs, archives and scripts are never allowed; link to the official source instead.'
		);
		continue;
	}

	if (!isAdmin) {
		// Code blocks are shown as text, so they can't run; check everything else.
		const prose = readFileSync(file, 'utf8')
			.replace(/^(`{3,}|~{3,})[\s\S]*?^\1/gm, '')
			.replace(/`[^`\n]*`/g, '');
		for (const [pattern, what] of UNSAFE_HTML) {
			const match = prose.match(pattern);
			if (match) fail(file, `Raw HTML isn't allowed in guides (found ${what}: "${match[0].trim()}").`);
		}
	}

	// External links on the lines this change adds.
	const added = git('diff', '--unified=0', `${base}...HEAD`, '--', file)
		.split('\n')
		.filter((line) => line.startsWith('+') && !line.startsWith('+++'));
	for (const line of added) {
		for (const [url] of line.matchAll(/https?:\/\/[^\s)<>"'\]]+/gi)) {
			if (!OWN_LINKS.test(url)) links.push({ file, url });
		}
	}
}

for (const { file, message } of errors) console.log(`::error file=${file}::${message}`);
for (const { file, url } of links) console.log(`::warning file=${file}::External link: ${url}`);

const summary = [
	'## Content check',
	'',
	errors.length === 0
		? `Passed. Author permission: \`${permission}\`.`
		: `Failed with ${errors.length} problem${errors.length === 1 ? '' : 's'}. Author permission: \`${permission}\`.`,
];
if (errors.length > 0) {
	summary.push('', ...errors.map(({ file, message }) => `- \`${file}\`: ${message}`));
}
if (links.length > 0) {
	summary.push(
		'',
		'### External links added',
		'',
		'Moderators: open each one and make sure it is an official source.',
		'',
		...links.map(({ file, url }) => `- \`${file}\`: <${url}>`)
	);
}

if (process.env.GITHUB_STEP_SUMMARY) {
	appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary.join('\n') + '\n');
} else {
	console.log(summary.join('\n'));
}

process.exit(errors.length > 0 ? 1 : 0);
