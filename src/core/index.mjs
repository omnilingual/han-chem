import KwangHjunGlyphs from './kwang-hjun-all-characters-table.mjs';

/**
 * @summary 全体收录字形。
 * @type {Set<string>}
 */
export const glyphs = new Set([
	...KwangHjunGlyphs.keys(),
	// TODO: 添加其他来源的字形；重复也不打紧。
]);

/**
 * 在《广韵》中查询字形信息。
 * @param {string} glyph 要检测的字形。
 * @returns {import('./kwang-hjun-all-characters-table/index.mjs').KwangHjunAllCharactersTableEntry[]}
 */
export function QueryRowsInKwangHjunByGlyph(glyph) {
	if(!KwangHjunGlyphs.has(glyph))
		return [];
	return KwangHjunGlyphs.get(glyph);
}

/**
 * 检测字形是否直接包含某个偏旁。
 * @param {string} glyph 要检测的字形。
 * @param {string[]} shapeParts 要检测的偏旁列表。
 * @returns {boolean}
 */
function IsGlyphContainingShapeParts(glyph, shapeParts) {
	// 《》
	if(KwangHjunGlyphs.has(glyph)) {
		for(const entry of KwangHjunGlyphs.get(glyph)) {
			for(const g of entry.shengXing_Xing) {
				if(shapeParts.includes(g))
					return true;
			}
			for(const g of entry.shengPang) {
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

	// 对所有字形进行广搜。

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