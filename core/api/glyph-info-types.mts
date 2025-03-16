/* 字形分类之定义。 */
/**
 * 传承字形。
 * @description
 * 此字段只指示字形是否为自古已有的，而不与简化字方案互斥。
 * 未简化过的字形与简化字形不同的繁体字均指示为 `true`。
*/
type GCTraditional = '傳承字';
/**
 * 第一批简化字形。
 * @description
 * 此字段只指示字形是否与第一批简化字方案兼容。
 * 未简化过的字形与第一批简化字都指示为 `true`，
 * 而繁体字、二简字与外国国字则指示为 `false`。
*/
type GCPrimarilySimplified = '簡化字';
/**
 * 第二批简化字形。
 * @description
 * 此字段只指示字形是否与第二批简化字方案兼容。
 * 未简化过的字形与第二批简化字都指示为 `true`，
 * 而繁体字、一简字与外国国字则指示为 `false`。
*/
type GCSecondlySimplified = '二級簡化字';
type GCStandards = GCTraditional | GCPrimarilySimplified | GCSecondlySimplified
type GCComposition = '聲旁' | '次級聲旁';
export type GlyphClassification = GCStandards | GCComposition;

/** 字形信息之结构体之定义。 */
export type GlyphInfo = {
	/** 基本信息。 */
	identity?: {
		/** 此字形对应的内在键名。 */
		key: string;
		/** 此字形对应的 Unicode 字符。 */
		unicodeCharacter: string | null;
		/** 此字形的分类。 */
		classifications: GlyphClassification[];
	};
	/** 字形学信息。 */
	composition: {
		method: '形聲' | '會意' | '整體' | '複聲' | '曡聲';
		/** 形旁。 */
		shapes: string[];
		/** 声旁。 */
		sounds: string[];
		notes?: string;
	};
	/** 音韵分析。 */
	phonology?: {
		/** 全部音韵信息记录。 */
		records: PhonologyRecord[];
	};
};

//#region Phonology
export type PhonologyRecord = {
	/** 时代。 */
	era: '上古' | '早期中古' | '晚期中古' | '近古' | '現代';
	/** 域，即此条信息出自哪个韵书，或来自哪门方言。 */
	domain: string;
	/** 音韵分析。 */
	analysis: OCPhonology | EMCPhonology | LMCPhonology | ModernPhonology | ContemporaryPhonology;
};

/** 上古音韻。 */
export type OCPhonology = {
	/** 韵部。 */
	rhymeClass: string;
	/** 拟音。 */
	reconstruction: string;
};

/** 早期中古音韻（反切）。 */
export type EMCPhonology = {
	/** 反切上字。 */
	top: string;
	/** 反切下字。 */
	bottom: string;
};

/** 晚期中古音韻。 */
export type LMCPhonology = {
	/** 声。 */
	initial: string;
	/** 摄。 */
	rhymeClass: string;
	/** 韵。 */
	rhyme: string;
	/** 调。 */
	tone: '平' | '上' | '去' | '入';
	/** 等。 */
	division: '一' | '二' | '三' | '四';
	/** 呼。 */
	medial: '开' | '合';
};

/** 近古音韻。 */
export type ModernPhonology = Omit<LMCPhonology, 'medial'> & {
	/** 呼。 */
	medial: '开' | '齐' | '合' | '撮';
};

/** 現代音韻。 */
export type ContemporaryPhonology = {
	/** 声。 */
	initial: string;
	/** 韵。 */
	rhyme: string;
	/** 調。 */
	tone: string;
};
//#endregion