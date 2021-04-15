import { promisify } from 'util';

// Imports that will be wrapped
import { readFile as readFileCB, readdir as readdirCB } from 'fs';

export const readFile = promisify(readFileCB);
export const readdir = promisify(readdirCB);