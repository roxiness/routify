/**
 * @type {import('./scroll')['PersistentScrollTo']}
 * @param {HTMLElement} el
 * @param {ScrollIntoViewOptions} options
 * @param {number} timeout
 */
// @ts-ignore
export const persistentScrollTo = (el, options, timeout) => {
    options = options || {}
    options.behavior = 'auto'
    const observer = new MutationObserver(() => {
        el.scrollIntoView(options)
    })
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
    })
    const stopScroll = () => {
        observer.disconnect()
    }
    if (timeout) {
        return new Promise(resolve =>
            setTimeout(() => {
                stopScroll()
                resolve()
            }, timeout),
        )
    } else {
        timeout
        return stopScroll
    }
}
