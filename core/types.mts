// 漢鑒数据层 · 公用类型库
// 上层立面已定（书证库 + 字形库，见 memory/汉鉴-设计.md），此处定义下层的具体类型与组合子。

//#region 音系与时代

/** 音系节点名（如「早期中古漢語」）；书证的读音以它为主语。 */
export type PhonologySystem = string;

/** 时代：汉语演进节点（全序，单射到音系树主干）。 */
export type Era = '原始' | '早期上古' | '晚期上古' | '早期中古' | '晚期中古' | '近代' | '现代';

/** 音系节点（音变树上的节点）。 */
export type PhonologicalSystem = {
	name: string;
	era: Era;
};

/** 亲缘边（音系 → 音系；音变规则留口子，未来 named）。 */
export type PhonologyEdge = {
	src: string;
	dst: string;
	label: string | null;
};

/** 来源（来源库节点）。 */
export type Source = {
	name: string;
	type: '韵书' | '辞书' | '构拟';
	phonology: string | null;
	era: Era;
};

/** 音类：某音系下的音韵地位（结构化分量）；转写是它的投影。 */
export type Reading = {
	system: PhonologySystem;
	components: Record<string, string>;
};

//#endregion

//#region 节点

/** 书证（Attestation）：字形 × 音类 × 时代 × 源 的扁平节点。 */
export type Attestation = {
	/** 自然键 = 字形-时代-读音。 */
	key: string;
	/** 字形库外键；只知读音无字形者为 null。 */
	glyph: string | null;
	/** 书目引用。 */
	source: string;
	/** 音韵地位；无读音者为 null。 */
	reading: Reading | null;
	/** 训释/义项（源书原文）。 */
	gloss: string | null;
};

/** 字形（Glyph）：identity 层节点。 */
export type Glyph = {
	/** 自然键 = opaque ID（现为 Unicode 字符，将来非 U 字用非字面键）。 */
	key: string;
	/** 字形字符（Unicode 字符；非 U 字为 null）。 */
	char: string | null;
	/** 编码字典（scheme → code）。 */
	encodings: Record<string, string>;
	/** 分类（传承字/简化字/…）。 */
	classifications: string[];
	/** 描述符标签（字类 + 算出的形声等）。 */
	tags: string[];
	/** 异体代表字形键（无异体字为 null）。 */
	representative: string | null;
};

//#endregion

//#region 边

/** 字源边（字形间关系，不涉音）。 */
export type EtymologyEdgeType = '祖先' | '转注' | '假借' | '同源' | '等价';

/** 读音边（同字形的读音关系）。 */
export type ReadingEdgeType = '系统音变' | '非系统音变' | '文白读' | '破读';

/** 文本边（文本用例关系）。 */
export type TextEdgeType = '押韵' | '异文';

/** 书证 → 书证 边类型。 */
export type AttestationEdgeType = EtymologyEdgeType | ReadingEdgeType | TextEdgeType;

/** 字形 → 字形 边类型。 */
export type GlyphEdgeType =
	| '部件' | '簡繁' | '異體' | '語義變體' | '兼容變體';

/** 部件 role（下位于「部件」）。 */
export type GlyphRole = '聲符' | '意符' | null;

/** 书证边。 */
export type AttestationEdge = {
	src: string;
	dst: string;
	type: AttestationEdgeType;
	source: string;
};

/** 字形边。 */
export type GlyphEdge = {
	src: string;
	dst: string;
	type: GlyphEdgeType;
	/** 部件 role（声符/义符；非部件边为 null）。 */
	role: GlyphRole;
	source: string;
};

//#endregion

//#region 算子

/** 测量算子：A → Maybe<B>。 */
export type Measurement<A, B> = (a: A) => B | null;

/** fmap：把测量算子抬升到数组容器 T<A> → T<Maybe<B>>。 */
export function fmap<A, B>(f: Measurement<A, B>): (as: A[]) => (B | null)[] {
	return (as) => as.map(f);
}

/** filter：按谓词筛选集合。 */
export function filter<A>(p: (a: A) => boolean): (as: A[]) => A[] {
	return (as) => as.filter(p);
}

/** join/flatten：摊平一层。 */
export function flatten<A>(ass: A[][]): A[] {
	return ass.flat();
}

/** bind/flatMap：map + join。 */
export function bind<A, B>(f: (a: A) => B[]): (as: A[]) => B[] {
	return (as) => as.flatMap(f);
}

/** 集合性属容器：字 = Collection<书证>。 */
export type GlyphCollection = Attestation[];

//#endregion
