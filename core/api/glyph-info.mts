import * as KwangHjun from '../kwang-hjun.mjs';
import type * as Types from './glyph-info-types.mts';

/** 依键名检测是否收录了某个字形。 */
export function HasGlyph(glyphKey: string): boolean {
	if(KwangHjun.HasGlyph(glyphKey))
		return true;
	return false;
}

/** 字形是否因非 Unicode 字符而采用索引收录。 */
export function IsIndexedGlyph(glyphKey: string): boolean {
	return true;
}

/**
 * 查询字形信息。
 * @param glyphKey 要检测的字形。
 */
export function QueryGlyphInfo(glyphKey: string): Types.GlyphInfo | null {
	if(!HasGlyph(glyphKey))
		return null;

	const info: Types.GlyphInfo = {
		identity: {
			key: glyphKey,
			unicodeCharacter: IsIndexedGlyph(glyphKey) ? glyphKey : null,
		},
		phonology: {
			records: []
		},
	};

	// 早期中古：《切韵》
	for(const entry of KwangHjun.QueryEntries(glyphKey)) {
		const emcAnalysis: Types.EMCPhonology = {
			initial: entry.shengNiu,
			division: entry.deng as Types.EMCPhonology['division'],
			medial: entry.hu as Types.EMCPhonology['medial'],
			rhymeClass: entry.she,
			rhyme: entry.yunBu_TiaoZhengHou,
			tone: entry.shengDiao as Types.EMCPhonology['tone'],
		};
		const record: Types.PhonologyRecord = {
			domain: '廣韻',
			era: '早期中古',
			analysis: emcAnalysis,
		};
		info.phonology.records.push(record);
	}

	return info;
}