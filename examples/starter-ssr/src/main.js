import App from './App.svelte'

// remove ssr html to avoid duplicate content
document.querySelector('body>[data-routify]').remove()
const app = new App({ target: document.body })

export default app
