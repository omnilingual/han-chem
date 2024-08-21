//#region Type definitions
const columns = [
	"xieShengXu", "xingXu", "sheng_MingXi", "shengXing_Sheng", "shengXing_Xing", "ziLei", "sheng_MingXi_", "shengXu", "shengPang", "fanQie_XiaoYunShouZi", "fanQie_YuanMao", "fanQie_ZhouZuMoJiao", "fanQie_YuNaiYongJiao", "fanQie_HeJiaoShuoMing", "ziTou_YuanMao", "ziTou_ZhouZuMoJiao", "ziTou_YuNaiYongJiao", "ziTou_HeJiaoShuoMing", "ziTou_Bu", "guangYunFanQieYuanMao_HeJiaoQian", "guangYunFanQie_HeJiaoHou", "shangZi", "xiaZi", "guangYunZiTouYuanMao_HeJiaoQian", "guangYunZiTou_HeJiaoHou", "guangYunShiYi", "shiYiBuChong", "guangYunZiXu", "qieYunNiYin_PoemBan", "qieYunPinYin_PoemBan", "shengNiu", "hu", "deng", "yunBu_TiaoZhengHou", "shengDiao", "zu", "she", "yunBuTiaoZhengShuoMing", "guangYunYunBuShunXu", "guangYunYunBuYuanMao_TiaoZhengQian", "yunBuYuanMao_PingShangQuRuXiangPeiWeiPing_TiaoZhengQian", "yunBuYuanMao_XiangPeiWeiPing_BingBiaoA_BLei_TiaoZhengQian", "xiaoYun_NiYinXiangTong_PoemBanFaYin", "kaiHeFenXi_GuoShe_HanHuan_YanFan_HaiHui_YuShe_TongShe_ZhenShe", "kaiHeFenXi_BangZu_GeGe_HanHuan_Tang_Tai_HaiHui_Hun_Mo_Dong_DongYi", "kaiHeFenXi_BangZu_Yang_YanFan_Yuan_Fei_Zhong_DongSan_You_Yu_Wen_Wei", "a_BLeiFenXi_YuGeZuShengNiuDaBei", "zhongGuPinYin_Polyhedron_Ban", "xianDaiGuangZhouYinLiLunYin", "yueSheng", "yueYun", "yueDiao", "xianDaiBeiJingYinLiLunYin", "jingSheng", "jingYun", "jingDiao", "guangYunYeXu", "yeNeiZiXu", "xiaoYunXu", "xiaoYunNeiZiXu", "quanWangBenQieYun_BuZi", "quanWangBenQieYun_ZiShu", "quanWangBenQieYun_FanQie", "peiBenQieYun_FanQie", "peiBenQieYun_ZiXu", "peiBenQieYun_ZiShu", "peiBenQieYun_BuZi", "yuPian_YuanBenYuPianCanJuan_ZhuanLiWanXiangMingYi", "yuPian_ShiFouJianYuYuanBenYuPianCanJuan", "yuPian_SongBenYuPian", "jingDianShiWen_PinYin_PoemBan", "jingDianShiWen_FanQie", "heBing_GuangYun", "heBing_GuangYun", "heBing_QieYunNiYin_PoemBan", "heBing_QieYunPinYin_PoemBan", "heBing_ZhongGuPinYin_Polyhedron_Ban", "shangZi_", "shangZi_QieYunPinYin_PoemBan", "shangZi_ShengNiu", "shangZi_Hu", "shangZi_Deng", "shangZi_YunBu", "shangZi_ShengDiao", "shangZi_Zu", "shangZi_She", "xiaZi_", "xiaZi_QieYunPinYin_PoemBan", "xiaZi_ShengNiu", "xiaZi_Hu", "xiaZi_Deng", "xiaZi_YunBu", "xiaZi_ShengDiao", "xiaZi_Zu", "xiaZi_She", "duiBi_ShengNiu_ShangZi_BeiQieZi", "duiBi_XiaZi_BeiQieZi_BuSheJiBangZu", "duiBi_Hu_BangZuXiaZi_QiTaZuBeiQieZi", "duiBi_Deng_XiaZi_BeiQieZi", "duiBi_YunBu_XiaZi_BeiQieZi", "duiBi_YunBuA_BLei_LaiNiuXiaZi_BangJianYingSanZuBeiQieZi", "duiBi_YunBuA_BLei_ZhiZuXiaZi_BangJianYingSanZuBeiQieZi", "duiBiYunBuA_BLei_QiTaZuXiaZi_BangJianYingSanZuBeiQieZi", "shangZi_QieYunPinYin_PoemBan", "shangZi_ZhongGuPinYin_Polyhedron_Ban", "xiaZi_QieYunPinYin_PoemBan", "xiaZi_ZhongGuPinYin_Polyhedron_Ban", "jianYiTiHuanWei", "shiFouShengPang", "shiFouCiJiShengPang", "shengXingXiWei", "xianQinYunBu_YinZiYuNaiYongDe_ShangGuYinXiYanJiu", "ziLiaoYinYong_QiTaBanBenDeZiTou"
];

//#region 字表行之類型定義
/**
 * @typedef {Object} KwangHjunAllCharactersTableEntry
 * 廣韻全字表之一行數據。
 * 字段按照駝峰規則，以漢語拼音照搬表頭；凡遇連續標點皆化爲單個下劃綫；末尾消重複之撇號亦作下劃綫。
 * @property {string} xieShengXu 諧聲序
 * @property {string} xingXu 形序
 * @property {string} sheng_MingXi 聲-明細
 * @property {string} shengXing_Sheng 聲形-聲
 * @property {string} shengXing_Xing 聲形-形
 * @property {string} ziLei 字類
 * @property {string} sheng_MingXi_ 聲-明細'
 * @property {string} shengXu 聲序
 * @property {string} shengPang 聲旁
 * @property {string} fanQie_XiaoYunShouZi 反切-小韻首字
 * @property {string} fanQie_YuanMao 反切-原貌
 * @property {string} fanQie_ZhouZuMoJiao 反切-周祖謨校
 * @property {string} fanQie_YuNaiYongJiao 反切-余迺永校
 * @property {string} fanQie_HeJiaoShuoMing 反切-覈校說明
 * @property {string} ziTou_YuanMao 字頭-原貌
 * @property {string} ziTou_ZhouZuMoJiao 字頭-周祖謨校
 * @property {string} ziTou_YuNaiYongJiao 字頭-余迺永校
 * @property {string} ziTou_HeJiaoShuoMing 字頭-覈校說明
 * @property {string} ziTou_Bu 字頭-補
 * @property {string} guangYunFanQieYuanMao_HeJiaoQian 廣韻反切原貌(覈校前)
 * @property {string} guangYunFanQie_HeJiaoHou 廣韻反切(覈校後)
 * @property {string} shangZi 上字
 * @property {string} xiaZi 下字
 * @property {string} guangYunZiTouYuanMao_HeJiaoQian 廣韻字頭原貌(覈校前)
 * @property {string} guangYunZiTou_HeJiaoHou 廣韻字頭(覈校後)
 * @property {string} guangYunShiYi 廣韻釋義
 * @property {string} shiYiBuChong 釋義補充
 * @property {string} guangYunZiXu 廣韻字序
 * @property {string} qieYunNiYin_PoemBan 切韻擬音(poem版)
 * @property {string} qieYunPinYin_PoemBan 切韻拼音(poem版)
 * @property {string} shengNiu 聲紐
 * @property {string} hu 呼
 * @property {string} deng 等
 * @property {string} yunBu_TiaoZhengHou 韻部(調整後)
 * @property {string} shengDiao 聲調
 * @property {string} zu 組
 * @property {string} she 攝
 * @property {string} yunBuTiaoZhengShuoMing 韻部調整說明
 * @property {string} guangYunYunBuShunXu 廣韻韻部順序
 * @property {string} guangYunYunBuYuanMao_TiaoZhengQian 廣韻韻部原貌(調整前)
 * @property {string} yunBuYuanMao_PingShangQuRuXiangPeiWeiPing_TiaoZhengQian 韻部原貌-平上去入相配爲平(調整前)
 * @property {string} yunBuYuanMao_XiangPeiWeiPing_BingBiaoA_BLei_TiaoZhengQian 韻部原貌-相配爲平並標A/B類(調整前)
 * @property {string} xiaoYun_NiYinXiangTong_PoemBanFaYin 小韻-擬音相同(poem版擬音)
 * @property {string} kaiHeFenXi_GuoShe_HanHuan_YanFan_HaiHui_YuShe_TongShe_ZhenShe 開合分析(果攝/寒桓/嚴凡/咍灰/遇攝/通攝/臻攝)
 * @property {string} kaiHeFenXi_BangZu_GeGe_HanHuan_Tang_Tai_HaiHui_Hun_Mo_Dong_DongYi 開合分析(幫組-歌戈/寒桓/唐/泰/咍灰/魂/模/冬/東一)
 * @property {string} kaiHeFenXi_BangZu_Yang_YanFan_Yuan_Fei_Zhong_DongSan_You_Yu_Wen_Wei 開合分析(幫組-陽/嚴凡/元/廢/鍾/東三/尤/虞/文/微）
 * @property {string} a_BLeiFenXi_YuGeZuShengNiuDaBei A/B類分析(與各組聲紐撘配)
 * @property {string} zhongGuPinYin_Polyhedron_Ban 中古拼音(polyhedron 版)
 * @property {string} xianDaiGuangZhouYinLiLunYin 現代廣州音理論音
 * @property {string} yueSheng 粵聲
 * @property {string} yueYun 粵韻
 * @property {string} yueDiao 粵調
 * @property {string} xianDaiBeiJingYinLiLunYin 現代北京音理論音
 * @property {string} jingSheng 京聲
 * @property {string} jingYun 京韻
 * @property {string} jingDiao 京調
 * @property {string} guangYunYeXu 廣韻頁序
 * @property {string} yeNeiZiXu 頁內字序
 * @property {string} xiaoYunXu 小韻序
 * @property {string} xiaoYunNeiZiXu 小韻內字序
 * @property {string} quanWangBenQieYun_BuZi 全王本切韻-補字
 * @property {string} quanWangBenQieYun_ZiShu 全王本切韻-字數
 * @property {string} quanWangBenQieYun_FanQie 全王本切韻-反切
 * @property {string} peiBenQieYun_FanQie 裴本切韻-反切
 * @property {string} peiBenQieYun_ZiXu 裴本切韻-字序
 * @property {string} peiBenQieYun_ZiShu 裴本切韻-字數
 * @property {string} peiBenQieYun_BuZi 裴本切韻-補字
 * @property {string} yuPian_YuanBenYuPianCanJuan_ZhuanLiWanXiangMingYi 玉篇-原本玉篇殘卷/篆隸萬象名義
 * @property {string} yuPian_ShiFouJianYuYuanBenYuPianCanJuan 玉篇-是否見於原本玉篇殘卷
 * @property {string} yuPian_SongBenYuPian 玉篇-宋本玉篇
 * @property {string} jingDianShiWen_PinYin_PoemBan 經典釋文-拼音(poem版)
 * @property {string} jingDianShiWen_FanQie 經典釋文-反切
 * @property {string} heBing_GuangYun 合併-廣韻
 * @property {string} heBing_GuangYun 合併-廣韻反切
 * @property {string} heBing_QieYunNiYin_PoemBan 合併-切韻擬音(poem版)
 * @property {string} heBing_QieYunPinYin_PoemBan 合併-切韻拼音(poem版)
 * @property {string} heBing_ZhongGuPinYin_Polyhedron_Ban 合併-中古拼音(polyhedron 版)
 * @property {string} shangZi_ 上字'
 * @property {string} shangZi_QieYunPinYin_PoemBan 上字-切韻拼音(poem版)
 * @property {string} shangZi_ShengNiu 上字-聲紐
 * @property {string} shangZi_Hu 上字-呼
 * @property {string} shangZi_Deng 上字-等
 * @property {string} shangZi_YunBu 上字-韻部
 * @property {string} shangZi_ShengDiao 上字-聲調
 * @property {string} shangZi_Zu 上字-組
 * @property {string} shangZi_She 上字-攝
 * @property {string} xiaZi_ 下字'
 * @property {string} xiaZi_QieYunPinYin_PoemBan 下字-切韻拼音(poem版)
 * @property {string} xiaZi_ShengNiu 下字-聲紐
 * @property {string} xiaZi_Hu 下字-呼
 * @property {string} xiaZi_Deng 下字-等
 * @property {string} xiaZi_YunBu 下字-韻部
 * @property {string} xiaZi_ShengDiao 下字-聲調
 * @property {string} xiaZi_Zu 下字-組
 * @property {string} xiaZi_She 下字-攝
 * @property {string} duiBi_ShengNiu_ShangZi_BeiQieZi 對比-聲紐(上字/被切字)
 * @property {string} duiBi_XiaZi_BeiQieZi_BuSheJiBangZu 對比-呼(下字/被切字)(不涉及幫組)
 * @property {string} duiBi_Hu_BangZuXiaZi_QiTaZuBeiQieZi 對比-呼(幫組下字/其他組被切字)
 * @property {string} duiBi_Deng_XiaZi_BeiQieZi 對比-等(下字/被切字)
 * @property {string} duiBi_YunBu_XiaZi_BeiQieZi 對比-韻部(下字/被切字)
 * @property {string} duiBi_YunBuA_BLei_LaiNiuXiaZi_BangJianYingSanZuBeiQieZi 對比-韻部A/B類(來紐下字/幫見影三組被切字)
 * @property {string} duiBi_YunBuA_BLei_ZhiZuXiaZi_BangJianYingSanZuBeiQieZi 對比-韻部A/B類(知組下字/幫見影三組被切字)
 * @property {string} duiBiYunBuA_BLei_QiTaZuXiaZi_BangJianYingSanZuBeiQieZi 對比韻部A/B類(其他組下字/幫見影三組被切字)
 * @property {string} shangZi_QieYunPinYin_PoemBan 上字-切韻擬音(poem版)
 * @property {string} shangZi_ZhongGuPinYin_Polyhedron_Ban 上字-中古拼音(polyhedron 版)
 * @property {string} xiaZi_QieYunPinYin_PoemBan 下字-切韻擬音(poem版)
 * @property {string} xiaZi_ZhongGuPinYin_Polyhedron_Ban 下字-中古拼音(polyhedron 版)
 * @property {string} jianYiTiHuanWei 建議替換爲
 * @property {string} shiFouShengPang 是否聲旁
 * @property {string} shiFouCiJiShengPang 是否次級聲旁
 * @property {string} shengXingXiWei 聲形析微
 * @property {string} xianQinYunBu_YinZiYuNaiYongDe_ShangGuYinXiYanJiu 先秦韻部（引自余迺永的《上古音系研究》）
 * @property {string} ziLiaoYinYong_QiTaBanBenDeZiTou 資料引用-其他版本的字頭
 */
//#endregion

/**
 * @callback FileProcessingContinuation
 * @param {number} currentPosition The current position we are processing.
 * @param {number} totalLength The total length of the file.
 */

//#endregion

//#region Export
const table = await (async () => {
	const fileContent = await ReadTableContentAsync();
	const rows = await ReadRowsFromTable(fileContent);
	return rows;
})();

/**
 * @summary 《广韵》全字形。每个字形可能对应多个条目；用数组承载。
 * @type {Map<string, KwangHjunAllCharactersTableEntry[]>}
 */
const glyphs = new Map();
for(const row of table) {
	const entry = row;
	const glyph = entry.guangYunZiTou_HeJiaoHou;
	if(!glyphs.has(glyph))
		glyphs.set(glyph, []);
	const entries = glyphs.get(glyph);
	entries.push(entry);
}

export default glyphs;
//#endregion

//#region Functions
import * as Path from 'path';
import * as Url from 'url';
const thisScriptDir = Path.dirname(Url.fileURLToPath(import.meta.url));
const tablePath = Path.resolve(thisScriptDir, './廣韻全字表.csv');

import * as Resource from './resources.mjs';
async function ReadTableContentAsync() {
	return (await Resource.LoadResourcesAsync(tablePath)).toString('utf-8');
}

/** @returns {Promise<KwangHjunAllCharactersTableEntry[]>} */
async function ReadRowsFromTable(fileContent) {
	const rows = [];
	const totalLength = fileContent.length;
	for(var startIndex = 0, rowCount = 0; startIndex < totalLength; ++rowCount) {
		var lineBreakIndex = fileContent.indexOf('\n', startIndex);
		if(lineBreakIndex == -1)
			lineBreakIndex = totalLength;
		var rowRaw = fileContent.substring(startIndex, lineBreakIndex);

		// Skip the header row.
		if(rowCount != 0) {
			const row = Object.fromEntries(rowRaw.split(',').map((v, i) => [columns[i], v]));
			rows.push(row);
		}

		startIndex = lineBreakIndex + 1;
	}

	return rows;
}
//#endregion