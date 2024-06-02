import * as KwangHjun from './kwang-hjun-all-characters-table/index.mjs';

async function Main() {
	const targetShapePart = '亼';
	const containingGlyphs = KwangHjun.FindAllGlyphsContainingShapePart(targetShapePart);

	console.log(`所有（直接或间接）包含"${targetShapePart}"的字形：`);
	console.log(`${Array.from(containingGlyphs.values()).join('')}`);
};

Main();