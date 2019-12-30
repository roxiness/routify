import App from './App.svelte'

const target = document.body
const app = new App({ target })

export default app

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    app.$destroy()
  })
  import.meta.hot.accept()
}
