import KwangHjunGlyphs from './kwang-hjun-all-characters-table/index.mjs';

/**
 * 检测字形是否直接包含某个偏旁。
 * @param {string} glyph 要检测的字形。
 * @param {string[]} shapeParts 要检测的偏旁列表。
 * @returns {boolean}
 */
function IsGlyphContainingShapeParts(glyph, shapeParts) {
	if(KwangHjunGlyphs.has(glyph)) {
		for(const row of KwangHjunGlyphs.get(glyph)) {
			for(const g of row.shengXing_Xing) {
				if(shapeParts.includes(g))
					return true;
			}
			for(const g of row.shengPang) {
				if(shapeParts.includes(g))
					return true;
			}
		}
	}
	return false;
}

/**
 * @summary 查询所有包含某个偏旁的字形。
 * @param {string} shapePart 要查询的偏旁。
 * @param {boolean} includesSelf 结果是否包含偏旁本身。
 * @returns {string[]}
 */
export function FindAllGlyphsContainingShapePart(shapePart, includesSelf = true) {
	if(!KwangHjunGlyphs.has(shapePart))
		return [];

	// Perform a BFS on all glyphs.

	const foundGlyphs = [];
	if(includesSelf)
		foundGlyphs.push(shapePart);
	const candidates = new Set(KwangHjunGlyphs.keys());
	candidates.delete(shapePart);

	for(
		const seeds = [shapePart];
		seeds.length > 0;
	) {
		const glyphsFoundInRound = [];
		for(const glyph of candidates) {
			if(!IsGlyphContainingShapeParts(glyph, seeds))
				continue;
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