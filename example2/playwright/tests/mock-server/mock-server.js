const test = require('ava');
const fetch = require('node-fetch')
const basepath = 'http://localhost:5432'

test('/date returns timestamp', async t => {
    const date = await fetch(basepath + '/date').then(res => res.text())
    t.assert(date.match(/\d{13}/), 'timestamp is 13 digits')
})

test('get /echo returns same data', async t => {
    const text = await fetch(basepath + '/echo?message=hello world').then(res => res.text())
    t.is(text, 'hello world')
})

test('post /echo returns same data', async t => {
    const json = await fetch(basepath + '/echo', {
        method: 'POST',
        body: JSON.stringify({ message: 'hello world' }),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
    t.is(json.message, 'hello world')
})

test('x-delay delays response', async t => {
    const timestamp = Date.now()
    const date = await fetch(basepath + '/date', {
        headers: { 'x-delay': 1000 }
    }).then(res => res.text())
    const diff = ((Date.now() - timestamp)/1000).toFixed(1) //round to one decimal
    t.assert(date.match(/\d{13}/), 'timestamp is 13 digits')
    t.is(diff, "1.0", '1 second has passed')
})

test('x-status-code sets response status code', async t => {
    const res = await fetch(basepath + '/date', { headers: { 'x-status-code': 200 } })
    t.is(200, res.status)

    const res2 = await fetch(basepath + '/date', { headers: { 'x-status-code': 300 } })
    t.is(300, res2.status)
})