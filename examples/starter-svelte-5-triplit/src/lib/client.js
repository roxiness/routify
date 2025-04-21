import { TriplitClient } from '@triplit/client'
import { schema } from '../../triplit/schema'

const TRIPLIT_SERVER_URL = import.meta.env.VITE_TRIPLIT_SERVER_URL
const TRIPLIT_TOKEN = import.meta.env.VITE_TRIPLIT_TOKEN

const isBrowser = typeof window !== 'undefined'

// The TriplitClient has 4 main options
// - storage: The storage engine you want to use. This can be
//   'memory' or 'indexeddb'.
// - schema: The schema you defined for your app, which
//   will be used to generate types for client methods
//   and handle local database operations
// - serverUrl: The URL of your Triplit server
// - token: The token you got from the Triplit dashboard
//
// Without the serverUrl or token, the client will operate in
// offline mode

export const triplit = new TriplitClient({
    storage: 'memory',
    schema,
    serverUrl: TRIPLIT_SERVER_URL,
    token: TRIPLIT_TOKEN,
    autoConnect: isBrowser,
})
// @ts-expect-error
if (isBrowser) window.triplit = triplit
export const Query = triplit.query
