/**
 * [file].meta.js files provides metadata for nodes.
 * They can be used instead of - or along with - inlined metadata.
 *
 * Here the entry would be available as `meta.routify` in the respective node
 * and all its descendants.
 *
 * Current directives are:
 * - split: uses codesplitting / dynamic import for the value. Entries that
 *          use the split tag must be accessed with `await` or `entry.then()`
 */

import axios from 'axios'

export default async context => {
    return {
        luke: (await axios.get('https://swapi.dev/api/people/1/')).data,
        'darth|split': (await axios.get('https://swapi.dev/api/people/4/')).data,
        leia: {
            value: (await axios.get('https://swapi.dev/api/people/5/')).data,
            split: true,
        },
    }
}
