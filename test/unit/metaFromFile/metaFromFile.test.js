import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { dirname} from "path";
import { fileURLToPath } from 'url';
import { htmlComments, externalComments } from '../../../middleware/metaFromFile/lib/index.js';


const __dirname = dirname(fileURLToPath(import.meta.url))

const ctx = {
    options: {
        routifyDir: `${__dirname}/output`
    }
}

test('inline meta', async () => {
    const path = `${__dirname}/example/inlineMeta.svelte`
    const meta = await htmlComments(path)
    assert.equal(meta, {
        'equal-sign-trimmed': 'meta',
        'equal-sign-right ': 'meta',
        'equal-sign-left': 'meta',
        'equal-sign-center ': 'meta',
        'an-array': ['item1', 'item2'],
        'an-object': { prop: { nested: 'value' } }
    })
})

test('external meta', async () => {
    const path = `${__dirname}/example/externalMeta.svelte`
    const meta = await externalComments(path, ctx.options.routifyDir)
    assert.equal(
        JSON.parse(JSON.stringify(meta)),
        { "prop": "value", "nested": { "nestedProp": "nestedValue" }, "codesplitted": {} }
    )
    assert.ok(meta.codesplitted.then)
    assert.snapshot(await meta.codesplitted, "I'm split")
})

test.run()