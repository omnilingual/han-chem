import * as Fs from 'fs/promises';
import * as Path from 'path';
import * as Url from 'url';

//#region Path constants
const thisScriptDir = Path.dirname(Url.fileURLToPath(import.meta.url));
const projectRootDir = Path.resolve(thisScriptDir, '..');
const resourceDir = Path.resolve(projectRootDir, 'resources');
//#endregion

/**
 * 
 * @param {string} path The relative path to `/resources`.
 * @returns {Promise<Buffer>}
 */
export function LoadResourcesAsync(path) {
	const path = Path.join(resourceDir, path);
	return Fs.readFile(path);
}