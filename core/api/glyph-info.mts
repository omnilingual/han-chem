import * as KwangHjun from '../kwang-hjun.mjs';

/**
 * 依键名检测是否收录了某个字形。
 * @param key 要检测的键名。
 */
export function HasGlyph(key: string): boolean {
	if(KwangHjun.HasGlyph(key))
		return true;
	return false;
}

//#region Type definitions
type GlyphInfo = {
	/** 对应此字形的内在键名。 */
	key: string;
	/** 基本信息。 */
	identity?: {
		//
	};
	/** 音韵分析。 */
	phonology?: {
		/** 全部音韵信息记录。 */
		records: PhonologyRecord[];
	};
};

type PhonologyRecord = {
	/** 时代。 */
	era: '上古' | '早期中古' | '晚期中古' | '近代' | '现代';
	/** 域，即此条信息出自哪个韵书，或来自哪门方言。 */
	domain: string;
	/** 音韵分析。 */
	analysis: OCPhonology | EMCPhonology | LMCPhonology;
};

type OCPhonology = {
	/** 韵部。 */
	rhymeClass: string;
	/** 拟音。 */
	reconstruction: string;
};

type MCPhonolgy = {
	/** 声。 */
	initial: string;
	/** 摄。 */
	rhymeClass: string;
	/** 韵。 */
	rhyme: string;
	/** 调。 */
	tone: '平' | '上' | '去' | '入';
};

type EMCPhonology = MCPhonolgy & {
	/** 等。 */
	division: '一' | '二' | '三' | '四';
	/** 呼。 */
	medial: '开' | '合';
};

type LMCPhonology = MCPhonolgy & {
	/** 呼。 */
	medial: '开' | '齐' | '合' | '撮';
};
//#endregion

/**
 * 查询字形信息。
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
			division: entry.deng as EMCPhonology['division'],
			medial: entry.hu as EMCPhonology['medial'],
			rhymeClass: entry.she,
			rhyme: entry.yunBu_TiaoZhengHou,
			tone: entry.shengDiao as EMCPhonology['tone'],
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