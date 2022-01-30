import styles from './styles.js'

const shadowStylesheets = [
    // 'https://unpkg.com/pollen-css',
    // 'https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css',
    // 'https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css',
]

const documentStylesheets = [
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,300italic,700,700italic',
]

const appendStylesheets = (element, stylesheets) => {
    stylesheets.forEach(stylesheet => {
        const link = document.createElement('link')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('href', stylesheet)
        element.appendChild(link)
    })
}

const mountHelper = async () => {
    const oldHelper = document.getElementById('routify-dev-helper-shadow')

    if (!oldHelper) {
        setTimeout(async () => {
            const el = document.createElement('div')
            el.id = 'routify-dev-helper-shadow'

            const shadowRoot = el.attachShadow({ mode: 'open' })

            appendStylesheets(shadowRoot, shadowStylesheets)
            appendStylesheets(document.head, documentStylesheets)

            const style = document.createElement('style')
            style.innerHTML = styles
            shadowRoot.appendChild(style)

            document.body.appendChild(el)

            const Helper = await import('./modal/Modal.svelte').then(r => r.default)
            new Helper({ target: shadowRoot })
            el.style['font-size'] = '14px'
        })
    }
}

mountHelper()
