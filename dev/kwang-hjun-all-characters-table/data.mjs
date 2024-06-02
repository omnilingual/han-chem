import * as DataLoader from './data-loader.mjs';

/**
 * @typedef {import('./data-loader.mjs').KwangHjunAllCharactersTableRow} KwangHjunAllCharactersTableRow
 * @typedef {Map<string, KwangHjunAllCharactersTableRow[]>} GlyphRecords
 */

const table = await DataLoader.LoadAsync();
/** @type {GlyphRecords} */
export const glyphs = new Map();
for(const row of table) {
	const glyph = row.guangYunZiTou_HeJiaoHou;
	if(!glyphs.has(glyph))
		glyphs.set(glyph, []);
	const entries = glyphs.get(glyph);
	entries.push(row);
}