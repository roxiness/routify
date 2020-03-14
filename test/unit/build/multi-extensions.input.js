export default {
  options: {
    pages: '/pages',
    extensions: ['svelte', 'svx'],
  },
  files: {
    '/pages/unrelated.md': '# not me',
    '/pages/index.svelte': 'index',
    '/pages/_layout.svelte': '<slot/>',
    '/pages/docs.page.svx': '# hello',
    '/pages/foo/unrelated.md': '# not me',
    '/pages/foo/_layout.svx': 'In Foo: <slot/>',
    '/pages/foo/docs.page.svx': '# foo',
    // this one should not match
    '/pages/bar/_layout.page.svelte': 'not me',
  },
}
