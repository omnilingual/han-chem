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
	// TODO
	return true;
}

/**
 * 查询字形信息。
 * @param glyphKey 要检测的字形。
 */
export function QueryGlyphInfo(glyphKey: string): Types.GlyphInfo | null {
	if(!HasGlyph(glyphKey))
		return null;

	// 先声明要返回的字形信息结构体。
	const info: Types.GlyphInfo = {
		identity: {
			key: glyphKey,
			unicodeCharacter: IsIndexedGlyph(glyphKey) ? glyphKey : null,
			classifications: [],
		},
		composition: {
			method: null,
			shapes: [],
			sounds: [],
		},
		phonology: {
			records: []
		},
	};
	/** 字形分类信息先加到这里，返回时再序列化。 */
	const classifications = new Set<Types.GlyphClassification>();

	// 讀取《廣韻》數據庫。
	for(const entry of KwangHjun.QueryEntries(glyphKey)) {
		// 记录字形学信息。
		// 若 `info.composition.method` 已被赋值则说明已经记录过（同一字形可能有多个条目）。
		if(!info.composition.method) {
			info.composition.method = entry.ziLei as Types.GlyphInfo['composition']['method'] || '形聲';
			info.composition.shapes = Array.from(entry.shengXing_Xing);
			info.composition.sounds = Array.from(entry.shengXing_Sheng);
			if(entry.shengXingXiWei)
				info.composition.notes = entry.shengXingXiWei;
		}

		/* 字形分類信息。 */
		// 《廣韻》里有考的一定是传承字形。
		classifications.add('傳承字');
		if(entry.shiFouShengPang)
			classifications.add('聲旁');
		if(entry.shiFouCiJiShengPang)
			classifications.add('次級聲旁');

		/* 《切韻》。 */

		if(entry.shangZi) {
			info.phonology.records.push({
				era: '早期中古',
				domain: '切韻',
				analysis: {
					top: entry.shangZi,
					bottom: entry.xiaZi,
				},
			});
		}

		/* 《廣韻》。 */

		info.phonology.records.push({
			era: '晚期中古',
			domain: '廣韻',
			analysis: {
				initial: entry.shengNiu,
				division: entry.deng as Types.LMCPhonology['division'],
				medial: entry.hu as Types.LMCPhonology['medial'],
				rhymeClass: entry.she,
				rhyme: entry.yunBu_TiaoZhengHou,
				tone: entry.shengDiao as Types.LMCPhonology['tone'],
			},
		});

		/* 北京官話。 */

		if(entry.xianDaiBeiJingYinLiLunYin) {
			info.phonology.records.push({
				era: '現代',
				domain: '北京官話',
				analysis: {
					initial: entry.jingSheng,
					rhyme: entry.jingYun,
					tone: entry.jingDiao,
				}
			});
		}

		/* 粵語。 */

		if(entry.xianDaiGuangZhouYinLiLunYin) {
			info.phonology.records.push({
				era: '現代',
				domain: '粵語',
				analysis: {
					initial: entry.yueSheng,
					rhyme: entry.yueYun,
					tone: entry.yueDiao,
				}
			});
		}
	}

	// 序列化字形分類信息。
	info.identity.classifications = Array.from(classifications.values());

	return info;
}