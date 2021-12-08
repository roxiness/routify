import { createBrowserAdapter } from '../BrowserAdapter.js'

const browserAdapter = createBrowserAdapter()
const { toBrowser, toRouter } = browserAdapter

const urlWithoutDefault = 'r2=/r2/address;r3=/r3/address'
const urlWithDefault = '/primary/address;r2=/r2/address;r3=/r3/address'

const router1 = { name: '', url: { external: () => '/primary/address' } }
const router2 = { name: 'r2', url: { external: () => '/r2/address' } }
const router3 = { name: 'r3', url: { external: () => '/r3/address' } }

test('should be able to get internal url for default router', () => {
    const url = toRouter(urlWithDefault, { name: '' })
    expect(url).toBe('/primary/address')
})

test('should be able to get internal url for router thats not default', () => {
    const url = toRouter(urlWithDefault, { name: 'r2' })
    expect(url).toBe('/r2/address')
})

test('should be able to get internal url with no default router', () => {
    const url = toRouter(urlWithoutDefault, { name: 'r2' })
    expect(url).toBe('/r2/address')
})

test('should be able to get external urls with default', () => {
    const res = toBrowser([router1, router2, router3])
    expect(res).toBe(urlWithDefault)
})

test('should be able to get external urls without default', () => {
    const res = toBrowser([router2, router3])
    expect(res).toBe(urlWithoutDefault)
})
