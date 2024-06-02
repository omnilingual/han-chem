import { glyphs } from './data.mjs';

/**
 * @typedef {import('./data.mjs').KwangHjunAllCharactersTableRow} KwangHjunAllCharactersTableRow
 * @typedef {import('./data.mjs').GlyphRecords} GlyphRecords
 */

/**
 * 检测《广韵》中的某字形是否直接包含某个偏旁。
 * @param {KwangHjunAllCharactersTableRow} row 要检测的字在《广韵》里的记录集。
 * @param {string[]} shapeParts 要检测的偏旁列表。
 * @returns {boolean}
 */
function IsRowContainingShapeParts(row, shapeParts) {
	for(const p of row.shengXing_Xing) {
		if(shapeParts.includes(p))
			return true;
	}
	return false;
}

/**
 * 检测某字是否包含某个偏旁。
 * @param {string} glyph 要检测的字。
 * @param {string} shapePart 要检测的偏旁。
 * @returns {boolean}
 */
export function IsGlyphContainingShapePart(glyph, shapePart) {
	// TODO.
}

/**
 * @summary 查询所有包含某个偏旁的字形。
 * @param {string} shapePart 要查询的偏旁。
 * @returns {string}
 */
export function FindAllGlyphsContainingShapePart(shapePart) {
	/** @type {string[]} */
	const foundGlyphs = [];

	if(!glyphs.has(shapePart))
		return foundGlyphs;

	foundGlyphs.push(shapePart);
	for(
		const
			candidates = new Map(glyphs.entries()),
			seeds = [shapePart];
		seeds.length > 0;
	) {
		const glyphsFoundInRound = [];
		for(const [glyph, rows] of candidates.entries()) {
			if(!rows.some(row => IsRowContainingShapeParts(row, seeds))) {
				continue;
			}
			glyphsFoundInRound.push(glyph);
			candidates.delete(glyph);
		}
		seeds.length = 0;
		for(const glyph of glyphsFoundInRound) {
			seeds.push(glyph);
			foundGlyphs.push(glyph);
		}
	}
	return foundGlyphs;
}