import * as KwangHjun from './resources/kwang-hjun/index.mjs';

/**
 * 依键名检测是否收录了某个字形。
 * @param {string} key 要检测的键名。
 * @returns {boolean}
 */
export function HasGlyph(key) {
	if(KwangHjun.HasGlyph(key))
		return true;
	return false;
}

//#region Type definitions
/**
	@typedef {{
		key: string; // 对应此字形的内在键名
		phonology: GlyphPhonology; // 音韵分析
	}} GlyphInfo

	@typedef {{
		records: PhonologyRecord[]; // 全部音韵信息记录
	}} GlyphPhonology 字形的音韵分析

	@typedef {{
		era: PhonologicalEra; // 时代
		domain: string; // 域，即此条信息出自哪个韵书，或来自哪门方言
		analysis: OCPhonology | EMCPhonology | LMCPhonology; // 音韵分析
	}} PhonologyRecord 字形的一条音韵信息
	@typedef {'old' | 'early middle' | 'late middle' | 'early modern' | 'modern'} PhonologicalEra

	@typedef {{
		bu: string; // 韵部
		reconstruction: string; // 拟音
	}} OCPhonology 上古音韵

	@typedef {{
		sheng: string; // 声
		she: string; // 摄
		yun: string; // 韵
		diao: MCDiao; // 调
	}} MCPhonolgy 中古音韵
	@typedef {'平' | '上' | '去' | '入'} MCDiao

	@typedef {MCPhonolgy & {
		deng: EMCDeng; // 等
		hu: EMCHu; // 呼
	}} EMCPhonology 早期中古音韵
	@typedef {'一' | '二' | '三' | '四'} EMCDeng
	@typedef {'开' | '合'} EMCHu

	@typedef {MCPhonolgy & {
		hu: LMCHu; // 呼
	}} LMCPhonology 晚期中古音韵
	@typedef {'开' | '齐' | '合' | '撮'} LMCHu
 */
//#endregion

/**
 * 查询字形信息。
 * @param {string} glyph 要检测的字形。
 * @returns {GlyphInfo | null}
 */
export function QueryGlyphInfo(glyph) {
	if(!HasGlyph(glyph))
		return null;
	/** @type {GlyphInfo} */

	const info = {
		key: glyph,
		phonology: {
			records: []
		},
	};

	// 早期中古：《切韵》
	for(const entry of KwangHjun.QueryEntries(glyph)) {
		/** @type {EMCPhonology} */
		const emc = {
			sheng: entry.shengNiu,
			deng: entry.deng,
			hu: entry.hu,
			she: entry.she,
			yun: entry.yunBu_TiaoZhengHou,
			diao: entry.shengDiao,
		};
		/** @type {PhonologyRecord} */
		const record = {
			domain: '廣韻',
			era: 'early middle',
			analysis: emc,
		};
		info.phonology.records.push(record);
	}

	return info;
}

/**
 * 检测字形是否直接包含某个偏旁。
 * @param {string} glyph 要检测的字形。
 * @param {string[]} shapeParts 要检测的偏旁列表。
 * @returns {boolean}
 */
export function IsGlyphContainingShapeParts(glyph, shapeParts) {
	// 《》
	if(KwangHjun.glyphs.has(glyph)) {
		for(const entry of KwangHjun.glyphs.get(glyph)) {
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
	if(!KwangHjun.glyphs.has(shapePart))
		return [];

	// 对所有字形进行广搜。

	const foundGlyphs = [];
	if(includesSelf)
		foundGlyphs.push(shapePart);
	const candidates = new Set(KwangHjun.glyphs.keys());
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