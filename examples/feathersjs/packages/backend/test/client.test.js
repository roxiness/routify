import assert from 'assert'
import axios from 'axios'
import { app } from '../src/app.js'
import { createClient } from '../src/client.js'

import rest from '@feathersjs/rest-client'

const port = app.get('port')
const appUrl = `http://${app.get('host')}:${port}`

describe('client tests', () => {
  const client = createClient(rest(appUrl).axios(axios))

  it('initialized the client', () => {
    assert.ok(client)
  })
})
