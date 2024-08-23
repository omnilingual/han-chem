export type GlyphInfo = {
	/** 基本信息。 */
	identity?: {
		/** 对应此字形的内在键名。 */
		key: string;
		unicodeCharacter: string | null;
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
	era: '上古' | '早期中古' | '晚期中古' | '近代' | '现代';
	/** 域，即此条信息出自哪个韵书，或来自哪门方言。 */
	domain: string;
	/** 音韵分析。 */
	analysis: OCPhonology | EMCPhonology | LMCPhonology;
};

export type OCPhonology = {
	/** 韵部。 */
	rhymeClass: string;
	/** 拟音。 */
	reconstruction: string;
};

export type MCPhonolgy = {
	/** 声。 */
	initial: string;
	/** 摄。 */
	rhymeClass: string;
	/** 韵。 */
	rhyme: string;
	/** 调。 */
	tone: '平' | '上' | '去' | '入';
};

export type EMCPhonology = MCPhonolgy & {
	/** 等。 */
	division: '一' | '二' | '三' | '四';
	/** 呼。 */
	medial: '开' | '合';
};

export type LMCPhonology = MCPhonolgy & {
	/** 呼。 */
	medial: '开' | '齐' | '合' | '撮';
};
//#endregion