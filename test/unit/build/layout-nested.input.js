export default {
  options: {
    pages: '/pages',
  },
  files: {
    '/pages/index.svelte': 'index',
    '/pages/_layout.svelte': '<slot/>',
    '/pages/foo/_layout.svelte': 'In Foo: <slot/>',
    '/pages/foo/index.svelte': 'foo',
  },
}
