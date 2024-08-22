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

function InitDom() {
	$result = document.getElementById('result');
	$glyphQueryForm = document.forms.namedItem('glyph-query-form');
	$glyphQueryInput = $glyphQueryForm['glyph'];
}

function EvalUrl() {
	const url = new URL(location.href);
	if(url.searchParams.has('glyph')) {
		document.body.classList.add('query');
		const glyph = url.searchParams.get('glyph');
		PerformQuery(glyph);
		$glyphQueryInput.placeholder = glyph;
	}
}

/**
 * @param {string} glyph
 */
async function PerformQuery(glyph) {
	const fetchUrl = new URL('/api/query-glyph-info', location.href);
	fetchUrl.searchParams.append('glyph', glyph);
	const response = await fetch(fetchUrl.href);
	try {
		if(response.status !== 200)
			throw new Error(`Error code ${response.status}: ${await response.text()}`);

		const result = await response.json();
		document.body.classList.remove('query');
		DisplayResult(result);

	}
	catch(error) {
		document.body.classList.add('error');
		console.error(error);
	}
}

/** @param {import('../../../core/index.mjs').GlyphInfo} result */
function DisplayResult(result) {
	document.body.classList.add('result');
	$result.innerText = JSON.stringify(result, null, 2);
}