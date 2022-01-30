const sleep = () => new Promise(requestAnimationFrame)

/**
 * Calls provided callback when scroll is idle
 * @param {Number} timeout
 * @returns {Promise}
 */
export const scrollIsIdle = (timeout = 100) =>
    new Promise(resolve => {
        let scrollTimeout

        const listener = async e => {
            clearTimeout(scrollTimeout)
            await sleep()
            scrollTimeout = setTimeout(() => {
                resolve()
                removeEventListener('scroll', listener)
            }, timeout)
        }

        addEventListener('scroll', listener)
    })
