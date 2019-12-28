export const scrollAncestorsToTop = function (element) {
    if (element && element.dataset.routify !== 'scroll-lock') {
        element.scrollTo(0, 0)
        scrollAncestorsToTop(element.parentElement)
    }
}