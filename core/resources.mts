import * as Path from 'path';
import * as Url from 'url';

const thisScriptDir = Path.dirname(Url.fileURLToPath(import.meta.url));
const projectRootDir = Path.resolve(thisScriptDir, '..');
const resourceDir = Path.join(projectRootDir, 'resources');

import * as Fs from 'fs/promises';

export async function Load(resourcePath: string): Promise<Buffer> {
	const realPath = Path.join(resourceDir, resourcePath);
	return Fs.readFile(realPath);
}