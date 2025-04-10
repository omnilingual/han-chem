(OnLoaded => {
	if(document.readyState !== 'complete')
		document.addEventListener('DOMContentLoaded', OnLoaded);
	else
		OnLoaded();
})(Main);

function Main() {
	InitDom();
	EvalUrl();
}

/** @type {HTMLElement} */
var $result;
/** @type {HTMLFormElement} */
var $glyphQueryForm;
/** @type {HTMLInputElement} */
var $glyphQueryInput;

const queryParamName = 'glyph-key';

function InitDom() {
	$result = document.getElementById('result');
	$glyphQueryForm = document.forms.namedItem('glyph-query-form');
	$glyphQueryInput = $glyphQueryForm[queryParamName];
}

function EvalUrl() {
	const url = new URL(location.href);
	if(url.searchParams.has(queryParamName)) {
		const query = url.searchParams.get(queryParamName);
		PerformQuery(query);
		$glyphQueryInput.value = query;
	}
}

/**
 * @param {string} query
 */
async function PerformQuery(query) {
	// Update document title.
	const $title = document.getElementsByTagName('title')[0];
	$title.innerText = `${$title.innerText}: ${query}`;

	const glyphs = query.split('');
	const responses = await Promise.allSettled(glyphs.map(QuerySingleGlyph));
	const results = responses;

	for(const [i, result] of results.entries())
		DisplayResult(glyphs[i], result);
}

/**
 * @param {string} glyph
 * @returns {Promise<{ [key: string]: any; } | null>}
 */
async function QuerySingleGlyph(glyph) {
	const fetchUrl = new URL('/api/query-glyph-info', location.href);
	fetchUrl.searchParams.append(queryParamName, glyph);
	const response = await fetch(fetchUrl.href);

	if(response.status !== 200)
		throw {
			code: response.status,
			message: await response.text(),
		};

	const result = await response.json();
	return result;
}

const tableColCount = 9;

/**
 * @param {string} glyph
 * @param {{ status: 'fulfilled'; value?: import('../../../core/api/glyph-info-types.mjs').GlyphInfo; } | { status: 'rejected'; reason: { code: number; message: string; }; }} result
 */
function DisplayResult(glyph, result) {
	function D(settings = {}) {
		const $ = document.createElement('div');
		$result.append($);
		if('text' in settings)
			$.innerText = settings.text;
		if('colspan' in settings)
			$.style.gridColumn = $`span ${+settings.colspan - 1}`;
		return $;
	};

	D({ text: glyph });

	if(result.status === 'rejected') {
		D({
			text: result.reason.message,
			colspan: tableColCount - 1,
		});
		return;
	}

	const info = result.value;

	// 小學

	D({ text: info.composition.method });
	D({ text: info.composition.shapes.join('') });
	D({ text: info.composition.sounds.join('') });

	// 音韻
	const [oc, emc, lmc, pk, ctn] = Array(5).fill().map(() => D());
	function P($, content) {
		if(typeof content === 'string') {
			const d = document.createElement('div');
			d.innerText = content;
			content = d;
		}
		$.append(content);
	}
	for(const record of info.phonology || []) {
		const domain = record.domain.split('/');
		switch(domain[domain.length - 1]) {
			case '上古':
				P(oc, `${record.top}${record.bottom}`);
				break;
			case '早期中古':
				if(record.source === '切韻')
					P(emc, `切韻：${record.top}${record.bottom}切`);
				break;
			case '晚期中古':
				if(record.source === '廣韻')
					P(lmc, `廣韻：${record.initial}${record.rhyme}${record.division}${record.medial}${record.tone}`);
				break;
			case '預測音': switch(domain[domain.length - 2]) {
				case '北京官話':
					P(pk, `預測音：${record.initial}${record.rhyme}${record.tone}`);
					break;
				case '粵語':
					P(ctn, `預測音：${record.initial}${record.rhyme}${record.tone}`);
					break;
			}
		}
	}
}