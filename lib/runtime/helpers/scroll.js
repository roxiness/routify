/**
 *
 * @param {HTMLElement} el
 * @param {ScrollIntoViewOptions} options
 * @param {number} timeout
 * @returns {()=>void} StopScroll
 */
export const persistentScrollTo = (el, options, timeout) => {
    // console.log('persist scroll for ', el)
    options = options || {}
    options.behavior = 'auto'
    const observer = new MutationObserver(() => {
        // console.log('persistent scroll')
        el.scrollIntoView(options)
    })
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
    })
    const stopScroll = () => {
        // console.log('end persistent scroll for', el)
        observer.disconnect()
    }
    if (timeout) setTimeout(stopScroll, timeout)
    return stopScroll
}
