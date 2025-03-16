(function(OnLoaded) {
	if(document.readyState !== 'complete')
		document.addEventListener('DOMContentLoaded', OnLoaded);
	else
		OnLoaded();
})(function() {
	InitDom();
	EvalUrl();
});

/** @type {HTMLElement} */
var $result;
/** @type {HTMLFormElement} */
var $glyphQueryForm;
/** @type {HTMLInputElement} */
var $glyphQueryInput;

const glyphKeySearchParamName = 'glyph-key';

function InitDom() {
	$result = document.getElementById('result');
	$glyphQueryForm = document.forms.namedItem('glyph-query-form');
	$glyphQueryInput = $glyphQueryForm[glyphKeySearchParamName];
}

function EvalUrl() {
	const url = new URL(location.href);
	if(url.searchParams.has(glyphKeySearchParamName)) {
		document.body.classList.add('query');
		const glyph = url.searchParams.get(glyphKeySearchParamName);
		PerformQuery(glyph);
		$glyphQueryInput.value = glyph;
	}
}

/**
 * @param {string} glyph
 */
async function PerformQuery(glyph) {
	const fetchUrl = new URL('/api/query-glyph-info', location.href);
	fetchUrl.searchParams.append(glyphKeySearchParamName, glyph);
	const response = await fetch(fetchUrl.href);

	if(response.status !== 200)
		return DisplayError(response.status, await response.text());

	const result = await response.json();
	document.body.classList.remove('query');
	DisplayResult(result);
}

/** @param {import('../../../core/index.mjs').GlyphInfo} result */
function DisplayResult(result) {
	document.body.classList.add('result');
	$result.classList.add('result');
	$result.innerText = JSON.stringify(result, null, 2);
}

function DisplayError(statusCode, message) {
	document.body.classList.add('error');
	$result.classList.add('error');
	$result.innerText = `Error ${statusCode}: ${message}`;
}