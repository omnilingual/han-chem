(OnLoaded => {
	if(document.readyState !== 'complete')
		document.addEventListener('DOMContentLoaded', OnLoaded);
	else
		OnLoaded();
})(Main);

function Main() {
	InitDom();
	LoadStats();
	EvalUrl();
}

let $stats, $result, $form, $kind, $query, $regex;

function InitDom() {
	$stats = document.getElementById('stats');
	$result = document.getElementById('result');
	$form = document.getElementById('search-form');
	$kind = document.getElementById('kind');
	$query = document.getElementById('query');
	$regex = document.getElementById('regex');
	$form.addEventListener('submit', function(ev) {
		ev.preventDefault();
		PerformSearch($query.value, $kind.value, $regex.checked);
	});
}

function EvalUrl() {
	const url = new URL(location.href);
	if(url.searchParams.has('q')) {
		const q = url.searchParams.get('q');
		$query.value = q;
		if(url.searchParams.has('kind'))
			$kind.value = url.searchParams.get('kind');
		if(url.searchParams.has('regex'))
			$regex.checked = url.searchParams.get('regex') === '1';
		PerformSearch(q, $kind.value, $regex.checked);
	}
}

async function LoadStats() {
	const res = await fetch('/api/db-preview/stats');
	const s = await res.json();
	renderStats(s);
}

function renderStats(s) {
	$stats.innerHTML = '';
	const grid = document.createElement('div');
	grid.className = 'stats-grid';
	const items = [
		['书证', s.attestations],
		['字形', s.glyphs],
		['书证边', s.attestationEdges],
		['字形边', s.glyphEdges],
	];
	for(const item of items) {
		const d = document.createElement('div');
		d.className = 'stat';
		const n = document.createElement('span');
		n.className = 'stat-n';
		n.innerText = item[1];
		const l = document.createElement('span');
		l.className = 'stat-label';
		l.innerText = item[0];
		d.append(n, l);
		grid.append(d);
	}
	$stats.append(grid);

	const bd = document.createElement('div');
	bd.className = 'breakdown';
	bd.append(breakdownTable('按源', s.bySource));
	$stats.append(bd);
}

function breakdownTable(title, obj) {
	const wrap = document.createElement('div');
	const h = document.createElement('h2');
	h.innerText = title;
	wrap.append(h);
	const t = document.createElement('table');
	for(const k of Object.keys(obj)) {
		const tr = document.createElement('tr');
		const td1 = document.createElement('td');
		td1.innerText = k;
		const td2 = document.createElement('td');
		td2.innerText = obj[k];
		tr.append(td1, td2);
		t.append(tr);
	}
	wrap.append(t);
	return wrap;
}

async function PerformSearch(q, kind, regex) {
	const url = new URL('/api/db-preview/search', location.href);
	url.searchParams.append('q', q);
	url.searchParams.append('kind', kind);
	url.searchParams.append('mode', regex ? 'regex' : 'literal');
	const res = await fetch(url.href);
	const data = await res.json();
	renderResults(kind, data);
}

function renderResults(kind, data) {
	$result.innerHTML = '';
	const h = document.createElement('h2');
	h.innerText = '结果（' + data.count + '）';
	$result.append(h);
	if(kind === 'attestation')
		renderAttestations(data.rows);
	else
		renderGlyphs(data.rows);
}

function renderAttestations(rows) {
	const t = document.createElement('table');
	t.append(tableHeader(['键', '字形', '源', '读音', '释义']));
	for(const r of rows) {
		const tr = document.createElement('tr');
		td(tr, r.key, 'key-cell');
		td(tr, r.glyph ?? '—');
		td(tr, r.source);
		td(tr, formatReading(r.reading));
		td(tr, r.gloss ?? '');
		t.append(tr);
	}
	$result.append(t);
}

function renderGlyphs(rows) {
	const t = document.createElement('table');
	t.append(tableHeader(['键', '字形', '编码', '分类', '标签']));
	for(const r of rows) {
		const tr = document.createElement('tr');
		td(tr, r.key, 'key-cell');
		td(tr, r.char ?? '—');
		td(tr, formatEncodings(r.encodings));
		td(tr, r.classifications.join('、'));
		td(tr, r.tags.join('、'));
		t.append(tr);
	}
	$result.append(t);
}

function formatReading(reading) {
	if(!reading)
		return '';
	const comps = [];
	for(const k of Object.keys(reading.components)) {
		const v = reading.components[k];
		if(v)
			comps.push(k + '=' + v);
	}
	return reading.system + (comps.length ? ' ' + comps.join(' ') : '');
}

function tableHeader(cols) {
	const tr = document.createElement('tr');
	for(const c of cols) {
		const th = document.createElement('th');
		th.innerText = c;
		tr.append(th);
	}
	return tr;
}

function td(tr, text, cls) {
	const d = document.createElement('td');
	d.innerText = text ?? '';
	if(cls)
		d.className = cls;
	tr.append(d);
}

function formatEncodings(enc) {
	if(!enc)
		return '';
	const parts = [];
	for(const k of Object.keys(enc))
		parts.push(k + '=' + enc[k]);
	return parts.join(' ');
}
