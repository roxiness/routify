/// <reference types="@roxi/routify" />

/**
 * [file].meta.js files provides metadata for nodes.
 * They can be used instead of - or along with - inlined metadata.
 *
 * Meta entries can use directives which enhance functionality.
 * These can be added to the entry name with a pipe, Eg.:
 *
 * `'routify|scoped': 'version 3'`
 *
 * Here the entry would be available as `meta.routify` in the respective node
 * and all its descendants.
 *
 * Current directives are:
 * - scoped: provides the meta entry to all descendant nodes
 * - split: uses codesplitting / dynamic import for the value. Entries that
 *          use the split tag must be accessed with `await` or `entry.then()`
 */

import axios from 'axios'

/**
 * @param {MetaContext} context
 */
export default async ({ split }) => {
    const luke = (await axios.get('https://swapi.dev/api/people/1/')).data
    const { name, gender, ...data } = luke

    return {
        luke: {
            name,
            gender,
            data: split(data),
        },
    }
}
