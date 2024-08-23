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
	@typedef {'上古' | '早期中古' | '晚期中古' | '近代' | '现代'} PhonologicalEra

	@typedef {{
		bu: string; // 韵部
		reconstruction: string; // 拟音
	}} OCPhonology 上古音韵

	@typedef {{
		initial: string; // 声
		rhymeClass: string; // 摄
		rhyme: string; // 韵
		tone: MCTone; // 调
	}} MCPhonolgy 中古音韵
	@typedef {'平' | '上' | '去' | '入'} MCTone

	@typedef {MCPhonolgy & {
		division: EMCDivision; // 等
		medial: EMCMedial; // 呼
	}} EMCPhonology 早期中古音韵
	@typedef {'一' | '二' | '三' | '四'} EMCDivision
	@typedef {'开' | '合'} EMCMedial

	@typedef {MCPhonolgy & {
		medial: LMCMedial; // 呼
	}} LMCPhonology 晚期中古音韵
	@typedef {'开' | '齐' | '合' | '撮'} LMCMedial
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
			initial: entry.shengNiu,
			division: entry.deng,
			medial: entry.hu,
			rhymeClass: entry.she,
			rhyme: entry.yunBu_TiaoZhengHou,
			tone: entry.shengDiao,
		};
		/** @type {PhonologyRecord} */
		const record = {
			domain: '廣韻',
			era: '早期中古',
			analysis: emc,
		};
		info.phonology.records.push(record);
	}

	return info;
}