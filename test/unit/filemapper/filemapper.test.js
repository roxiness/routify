import { test, suite } from 'uvu';
import * as assert from 'uvu/assert';
import { filemapper } from '../../../middleware/filemapper/lib/filemapper.js'
import { dirname, resolve, sep } from "path";
import { fileURLToPath } from 'url';
import { Node } from '../../../lib/node.js';


const examplePath = `${dirname(fileURLToPath(import.meta.url))}/example`

const foo = suite('foo')



test('foo', async () => {
    const root = new Node()
    
    await filemapper(examplePath, root)
    console.log( root.children[1].children )
})

test.run()