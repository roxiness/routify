import App from './App.svelte'
import './styles.css'

new App({
    target: document.body,
    hydrate: import.meta.env.ROUTIFY_SSR_ENABLE,
})
