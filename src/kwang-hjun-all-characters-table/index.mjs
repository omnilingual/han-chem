import * as Data from './data.mjs';

const table = await Data.LoadAsync();
/**
 * @summary 《广韵》全字形。每个字形可能对应多个条目；用数组承载。
 * @type {Map<string, KwangHjunAllCharactersTableEntry[]>}
 */
const glyphs = new Map();
for(const row of table) {
	const entry = row;
	const glyph = entry.guangYunZiTou_HeJiaoHou;
	if(!glyphs.has(glyph))
		glyphs.set(glyph, []);
	const entries = glyphs.get(glyph);
	entries.push(entry);
}

export default glyphs;