import * as KwangHjun from '../kwang-hjun.mjs';
import type * as Types from './glyph-info-types.mts';
import Lodash, { at } from 'lodash';

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

type PhonologicalDomain = Types.PhonologyRecord['domain'];
const pdSortLookUp: {
	[key in PhonologicalDomain]?: number;
} = {
	上古: 0,
	早期中古: 1,
	晚期中古: 2,
	近古: 3,
	現代: 4,
};
export function ComparePhonologicalDomain(a: PhonologicalDomain, b: PhonologicalDomain): number {
	if(a === b)
		return 0;

	const aTop = a.split('/')[0] as PhonologicalDomain, bTop = b.split('/')[0] as PhonologicalDomain;

	if((aTop in pdSortLookUp) && (bTop in pdSortLookUp)) {
		if(aTop !== bTop)
			return pdSortLookUp[aTop] - pdSortLookUp[bTop];
	}

	if(!(aTop in pdSortLookUp)) {
		if(bTop in pdSortLookUp)
			return 1;
		return (a > b) ? 1 : -1;
	}
	if(!(bTop in pdSortLookUp))
		return -1;

	return (a > b) ? 1 : -1;
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
			properties: [],
		},
		composition: {
			method: null,
			shapes: [],
			sounds: [],
		},
		phonology: [],
	};
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

		/* 字形分類與屬性信息。 */
		// 《廣韻》里有考的一定是传承字形。
		info.identity.classifications.push('傳承字');
		if(entry.shiFouShengPang)
			info.identity.properties.push('聲旁');
		if(entry.shiFouCiJiShengPang)
			info.identity.properties.push('次級聲旁');

		/* 《切韻》。 */

		if(entry.shangZi) {
			info.phonology.push({
				domain: '早期中古',
				source: '切韻',
				top: entry.shangZi,
				bottom: entry.xiaZi,
			});
		}

		/* 《廣韻》。 */

		info.phonology.push({
			domain: '晚期中古',
			source: '廣韻',
			initial: entry.shengNiu,
			division: entry.deng as Types.LMCPhonology['division'],
			medial: entry.hu as Types.LMCPhonology['medial'],
			rhymeClass: entry.she,
			rhyme: entry.yunBu_TiaoZhengHou,
			tone: entry.shengDiao as Types.LMCPhonology['tone'],
		});

		/* 北京官話預測音。 */

		if(entry.xianDaiBeiJingYinLiLunYin) {
			info.phonology.push({
				domain: '現代/北京官話/預測音',
				initial: entry.jingSheng,
				rhyme: entry.jingYun,
				tone: entry.jingDiao,
			});
		}

		/* 粵語預測音。 */

		if(entry.xianDaiGuangZhouYinLiLunYin) {
			info.phonology.push({
				domain: '現代/粵語/預測音',
				initial: entry.yueSheng,
				rhyme: entry.yueYun,
				tone: entry.yueDiao,
			});
		}
	}

	//#region 後處理

	// 對字形分類與屬性信息去重。
	info.identity.classifications = Lodash.uniq(info.identity.classifications);
	info.identity.properties = Lodash.uniq(info.identity.properties);

	// 對音韻信息排序。
	info.phonology.sort((a, b) => ComparePhonologicalDomain(a.domain, b.domain));

	//#endregion

	return info;
}