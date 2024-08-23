//#region Type definitions
const columns = [
	"xieShengXu", "xingXu", "sheng_MingXi", "shengXing_Sheng", "shengXing_Xing", "ziLei", "sheng_MingXi_", "shengXu", "shengPang", "fanQie_XiaoYunShouZi", "fanQie_YuanMao", "fanQie_ZhouZuMoJiao", "fanQie_YuNaiYongJiao", "fanQie_HeJiaoShuoMing", "ziTou_YuanMao", "ziTou_ZhouZuMoJiao", "ziTou_YuNaiYongJiao", "ziTou_HeJiaoShuoMing", "ziTou_Bu", "guangYunFanQieYuanMao_HeJiaoQian", "guangYunFanQie_HeJiaoHou", "shangZi", "xiaZi", "guangYunZiTouYuanMao_HeJiaoQian", "guangYunZiTou_HeJiaoHou", "guangYunShiYi", "shiYiBuChong", "guangYunZiXu", "qieYunNiYin_PoemBan", "qieYunPinYin_PoemBan", "shengNiu", "hu", "deng", "yunBu_TiaoZhengHou", "shengDiao", "zu", "she", "yunBuTiaoZhengShuoMing", "guangYunYunBuShunXu", "guangYunYunBuYuanMao_TiaoZhengQian", "yunBuYuanMao_PingShangQuRuXiangPeiWeiPing_TiaoZhengQian", "yunBuYuanMao_XiangPeiWeiPing_BingBiaoA_BLei_TiaoZhengQian", "xiaoYun_NiYinXiangTong_PoemBanFaYin", "kaiHeFenXi_GuoShe_HanHuan_YanFan_HaiHui_YuShe_TongShe_ZhenShe", "kaiHeFenXi_BangZu_GeGe_HanHuan_Tang_Tai_HaiHui_Hun_Mo_Dong_DongYi", "kaiHeFenXi_BangZu_Yang_YanFan_Yuan_Fei_Zhong_DongSan_You_Yu_Wen_Wei", "a_BLeiFenXi_YuGeZuShengNiuDaBei", "zhongGuPinYin_Polyhedron_Ban", "xianDaiGuangZhouYinLiLunYin", "yueSheng", "yueYun", "yueDiao", "xianDaiBeiJingYinLiLunYin", "jingSheng", "jingYun", "jingDiao", "guangYunYeXu", "yeNeiZiXu", "xiaoYunXu", "xiaoYunNeiZiXu", "quanWangBenQieYun_BuZi", "quanWangBenQieYun_ZiShu", "quanWangBenQieYun_FanQie", "peiBenQieYun_FanQie", "peiBenQieYun_ZiXu", "peiBenQieYun_ZiShu", "peiBenQieYun_BuZi", "yuPian_YuanBenYuPianCanJuan_ZhuanLiWanXiangMingYi", "yuPian_ShiFouJianYuYuanBenYuPianCanJuan", "yuPian_SongBenYuPian", "jingDianShiWen_PinYin_PoemBan", "jingDianShiWen_FanQie", "heBing_GuangYun", "heBing_GuangYun", "heBing_QieYunNiYin_PoemBan", "heBing_QieYunPinYin_PoemBan", "heBing_ZhongGuPinYin_Polyhedron_Ban", "shangZi_", "shangZi_QieYunPinYin_PoemBan", "shangZi_ShengNiu", "shangZi_Hu", "shangZi_Deng", "shangZi_YunBu", "shangZi_ShengDiao", "shangZi_Zu", "shangZi_She", "xiaZi_", "xiaZi_QieYunPinYin_PoemBan", "xiaZi_ShengNiu", "xiaZi_Hu", "xiaZi_Deng", "xiaZi_YunBu", "xiaZi_ShengDiao", "xiaZi_Zu", "xiaZi_She", "duiBi_ShengNiu_ShangZi_BeiQieZi", "duiBi_XiaZi_BeiQieZi_BuSheJiBangZu", "duiBi_Hu_BangZuXiaZi_QiTaZuBeiQieZi", "duiBi_Deng_XiaZi_BeiQieZi", "duiBi_YunBu_XiaZi_BeiQieZi", "duiBi_YunBuA_BLei_LaiNiuXiaZi_BangJianYingSanZuBeiQieZi", "duiBi_YunBuA_BLei_ZhiZuXiaZi_BangJianYingSanZuBeiQieZi", "duiBiYunBuA_BLei_QiTaZuXiaZi_BangJianYingSanZuBeiQieZi", "shangZi_QieYunPinYin_PoemBan", "shangZi_ZhongGuPinYin_Polyhedron_Ban", "xiaZi_QieYunPinYin_PoemBan", "xiaZi_ZhongGuPinYin_Polyhedron_Ban", "jianYiTiHuanWei", "shiFouShengPang", "shiFouCiJiShengPang", "shengXingXiWei", "xianQinYunBu_YinZiYuNaiYongDe_ShangGuYinXiYanJiu", "ziLiaoYinYong_QiTaBanBenDeZiTou"
];

/** @summary 字表行之類型定義。 */
interface KwangHjunEntry {
	xieShengXu: string;
	xingXu: string;
	sheng_MingXi: string;
	shengXing_Sheng: string;
	shengXing_Xing: string;
	ziLei: string;
	sheng_MingXi_: string;
	shengXu: string;
	shengPang: string;
	fanQie_XiaoYunShouZi: string;
	fanQie_YuanMao: string;
	fanQie_ZhouZuMoJiao: string;
	fanQie_YuNaiYongJiao: string;
	fanQie_HeJiaoShuoMing: string;
	ziTou_YuanMao: string;
	ziTou_ZhouZuMoJiao: string;
	ziTou_YuNaiYongJiao: string;
	ziTou_HeJiaoShuoMing: string;
	ziTou_Bu: string;
	guangYunFanQieYuanMao_HeJiaoQian: string;
	guangYunFanQie_HeJiaoHou: string;
	shangZi: string;
	xiaZi: string;
	guangYunZiTouYuanMao_HeJiaoQian: string;
	guangYunZiTou_HeJiaoHou: string;
	guangYunShiYi: string;
	shiYiBuChong: string;
	guangYunZiXu: string;
	qieYunNiYin_PoemBan: string;
	qieYunPinYin_PoemBan: string;
	shengNiu: string;
	hu: string;
	deng: string;
	yunBu_TiaoZhengHou: string;
	shengDiao: string;
	zu: string;
	she: string;
	yunBuTiaoZhengShuoMing: string;
	guangYunYunBuShunXu: string;
	guangYunYunBuYuanMao_TiaoZhengQian: string;
	yunBuYuanMao_PingShangQuRuXiangPeiWeiPing_TiaoZhengQian: string;
	yunBuYuanMao_XiangPeiWeiPing_BingBiaoA_BLei_TiaoZhengQian: string;
	xiaoYun_NiYinXiangTong_PoemBanFaYin: string;
	kaiHeFenXi_GuoShe_HanHuan_YanFan_HaiHui_YuShe_TongShe_ZhenShe: string;
	kaiHeFenXi_BangZu_GeGe_HanHuan_Tang_Tai_HaiHui_Hun_Mo_Dong_DongYi: string;
	kaiHeFenXi_BangZu_Yang_YanFan_Yuan_Fei_Zhong_DongSan_You_Yu_Wen_Wei: string;
	a_BLeiFenXi_YuGeZuShengNiuDaBei: string;
	zhongGuPinYin_Polyhedron_Ban: string;
	xianDaiGuangZhouYinLiLunYin: string;
	yueSheng: string;
	yueYun: string;
	yueDiao: string;
	xianDaiBeiJingYinLiLunYin: string;
	jingSheng: string;
	jingYun: string;
	jingDiao: string;
	guangYunYeXu: string;
	yeNeiZiXu: string;
	xiaoYunXu: string;
	xiaoYunNeiZiXu: string;
	quanWangBenQieYun_BuZi: string;
	quanWangBenQieYun_ZiShu: string;
	quanWangBenQieYun_FanQie: string;
	peiBenQieYun_FanQie: string;
	peiBenQieYun_ZiXu: string;
	peiBenQieYun_ZiShu: string;
	peiBenQieYun_BuZi: string;
	yuPian_YuanBenYuPianCanJuan_ZhuanLiWanXiangMingYi: string;
	yuPian_ShiFouJianYuYuanBenYuPianCanJuan: string;
	yuPian_SongBenYuPian: string;
	jingDianShiWen_PinYin_PoemBan: string;
	jingDianShiWen_FanQie: string;
	heBing_GuangYun: string;
	heBing_QieYunNiYin_PoemBan: string;
	heBing_QieYunPinYin_PoemBan: string;
	heBing_ZhongGuPinYin_Polyhedron_Ban: string;
	shangZi_: string;
	shangZi_ShengNiu: string;
	shangZi_Hu: string;
	shangZi_Deng: string;
	shangZi_YunBu: string;
	shangZi_ShengDiao: string;
	shangZi_Zu: string;
	shangZi_She: string;
	xiaZi_: string;
	xiaZi_ShengNiu: string;
	xiaZi_Hu: string;
	xiaZi_Deng: string;
	xiaZi_YunBu: string;
	xiaZi_ShengDiao: string;
	xiaZi_Zu: string;
	xiaZi_She: string;
	duiBi_ShengNiu_ShangZi_BeiQieZi: string;
	duiBi_XiaZi_BeiQieZi_BuSheJiBangZu: string;
	duiBi_Hu_BangZuXiaZi_QiTaZuBeiQieZi: string;
	duiBi_Deng_XiaZi_BeiQieZi: string;
	duiBi_YunBu_XiaZi_BeiQieZi: string;
	duiBi_YunBuA_BLei_LaiNiuXiaZi_BangJianYingSanZuBeiQieZi: string;
	duiBi_YunBuA_BLei_ZhiZuXiaZi_BangJianYingSanZuBeiQieZi: string;
	duiBiYunBuA_BLei_QiTaZuXiaZi_BangJianYingSanZuBeiQieZi: string;
	shangZi_QieYunPinYin_PoemBan: string;
	shangZi_ZhongGuPinYin_Polyhedron_Ban: string;
	xiaZi_QieYunPinYin_PoemBan: string;
	xiaZi_ZhongGuPinYin_Polyhedron_Ban: string;
	jianYiTiHuanWei: string;
	shiFouShengPang: string;
	shiFouCiJiShengPang: string;
	shengXingXiWei: string;
	xianQinYunBu_YinZiYuNaiYongDe_ShangGuYinXiYanJiu: string;
	ziLiaoYinYong_QiTaBanBenDeZiTou: string;
}
//#endregion

//#region Export
const table = await (async () => {
	const fileContent = await ReadTableContentAsync();
	const entries = await ReadEntriesFromTable(fileContent);
	return entries;
})();

/** @summary 《广韵》全字形。每个字形可能对应多个条目；用数组承载。 */
export const glyphs: Map<string, KwangHjunEntry[]> = new Map();
for(const entry of table) {
	const glyph = entry.guangYunZiTou_HeJiaoHou;
	if(!glyphs.has(glyph))
		glyphs.set(glyph, []);
	const entries = glyphs.get(glyph);
	entries.push(entry);
}
//#endregion

//#region Functions
import * as Resources from './resources.mjs';
async function ReadTableContentAsync() {
	return (await Resources.Load('kwang-hjun/廣韻全字表.csv')).toString('utf-8');
}

async function ReadEntriesFromTable(fileContent: string): Promise<KwangHjunEntry[]> {
	const entries = [];
	const totalLength = fileContent.length;
	for(var startIndex = 0, entryCount = 0; startIndex < totalLength; ++entryCount) {
		var lineBreakIndex = fileContent.indexOf('\n', startIndex);
		if(lineBreakIndex == -1)
			lineBreakIndex = totalLength;
		var entryRaw = fileContent.substring(startIndex, lineBreakIndex);

		// Skip the header entry.
		if(entryCount != 0) {
			const entry = Object
			.fromEntries(entryRaw.split(',')
				.map((v, i) => [columns[i], v]));
			entries.push(entry);
		}

		startIndex = lineBreakIndex + 1;
	}

	return entries;
}

/** @summary 查询《广韵》中是否收录字形。 */
export function HasGlyph(glyph: string): boolean {
	return glyphs.has(glyph);
}

/** @summary 在《广韵》中查询字形信息。 */
export function QueryEntries(glyph: string): KwangHjunEntry[] {
	if(!HasGlyph(glyph))
		return [];
	return glyphs.get(glyph);
}
//#endregion