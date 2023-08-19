/**
 * Strips trailing /index from a url
 *  @returns {RoutifyRuntimePlugin}
 **/
export default () => ({
    urlRewrite: [
        {
            toExternal: url => url.replace(/\/index(?=$|\?|#)/, ''),
            toInternal: url => url,
        },
    ],
})
