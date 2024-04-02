import * as KwangHjunAllCharactersTable from './kwang-hjun-all-characters-table/index.mjs';

function LineBreak(count = 1) {
	while(count-- > 0)
		console.log('');
}

(async function() {
	console.log('開始加載廣韻全字表……');
	var table = await KwangHjunAllCharactersTable.LoadAsync();
	console.log('廣韻全字表已加載完成。');

	LineBreak();

	/** @type {Map<string, KwangHjunAllCharactersTable.KwangHjunAllCharactersTableRow[]>} */
	let kwangHjunGlyphs = new Map();
	for(let row of table) {
		let glyph = row.guangYunZiTou_HeJiaoHou;
		if(!kwangHjunGlyphs.has(glyph))
			kwangHjunGlyphs.set(glyph, []);
		let entries = kwangHjunGlyphs.get(glyph);
		entries.push(row);
	}
	console.log(`此表中共收錄了 ${kwangHjunGlyphs.size} 個漢字。`);
})();