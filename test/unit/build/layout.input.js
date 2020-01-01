export default {
  options: {
    pages: '/pages',
  },
  files: {
    '/pages/index.svelte': 'index',
    '/pages/_layout.svelte': '<slot/>',
  },
}
