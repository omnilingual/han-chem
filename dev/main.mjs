import * as HanChem from './index.mjs';

async function Main() {
	const targetShapePart = '僉';
	const containingGlyphs = HanChem.FindAllGlyphsContainingShapePart(targetShapePart);

	console.log(`所有（直接或间接）包含"${targetShapePart}"的字形：`);
	console.log(`${Array.from(containingGlyphs.values()).join('')}`);
};

Main();