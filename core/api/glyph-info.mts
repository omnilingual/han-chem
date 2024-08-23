import * as KwangHjun from '../kwang-hjun.mjs';

/**
 * @summary 依键名检测是否收录了某个字形。
 * @param key 要检测的键名。
 */
export function HasGlyph(key: string): boolean {
	if(KwangHjun.HasGlyph(key))
		return true;
	return false;
}

//#region Type definitions
type GlyphInfo = {
	key: string; // 对应此字形的内在键名
	phonology: GlyphPhonology; // 音韵分析
};

type GlyphPhonology = {
	records: PhonologyRecord[]; // 全部音韵信息记录
};

type PhonologyRecord = {
	era: PhonologicalEra; // 时代
	domain: string; // 域，即此条信息出自哪个韵书，或来自哪门方言
	analysis: OCPhonology | EMCPhonology | LMCPhonology; // 音韵分析
};

type PhonologicalEra = '上古' | '早期中古' | '晚期中古' | '近代' | '现代';

type OCPhonology = {
	bu: string; // 韵部
	reconstruction: string; // 拟音
};

type MCPhonolgy = {
	initial: string; // 声
	rhymeClass: string; // 摄
	rhyme: string; // 韵
	tone: MCTone; // 调
};

type MCTone = '平' | '上' | '去' | '入';

type EMCPhonology = MCPhonolgy & {
	division: EMCDivision; // 等
	medial: EMCMedial; // 呼
};

type EMCDivision = '一' | '二' | '三' | '四';

type EMCMedial = '开' | '合';

type LMCPhonology = MCPhonolgy & {
	medial: LMCMedial; // 呼
};

type LMCMedial = '开' | '齐' | '合' | '撮';
//#endregion

/**
 * @summary 查询字形信息。
 * @param glyph 要检测的字形。
 */
export function QueryGlyphInfo(glyph: string): GlyphInfo | null {
	if(!HasGlyph(glyph))
		return null;

	const info: GlyphInfo = {
		key: glyph,
		phonology: {
			records: []
		},
	};

	// 早期中古：《切韵》
	for(const entry of KwangHjun.QueryEntries(glyph)) {
		const emc: EMCPhonology = {
			initial: entry.shengNiu,
			division: entry.deng as EMCDivision,
			medial: entry.hu as EMCMedial,
			rhymeClass: entry.she,
			rhyme: entry.yunBu_TiaoZhengHou,
			tone: entry.shengDiao as MCTone,
		};
		const record: PhonologyRecord = {
			domain: '廣韻',
			era: '早期中古',
			analysis: emc,
		};
		info.phonology.records.push(record);
	}

	return info;
}