// wrap console.warn without losing line numbers and preserve 12 lines of stack
export const killWarnings = () => {
    var originalWarn = console.warn

    console.warn = function () {
        // Convert arguments object to array
        var args = Array.prototype.slice.call(arguments)

        // If message contains the word "context", then just return
        if (args[0].match(/<.+> was created with unknown prop 'context'/)) return
        if (args[0].match(/<.+> was created with unknown prop 'isRoot'/)) return
        if (args[0].match(/<.+> received an unexpected slot "default"\./)) return

        // Create a stack trace
        var stackTrace = new Error().stack

        // Check the third line of the stack trace for the call site
        // (first line is "Error", second line is this function, third line is caller)
        var callSite = stackTrace.split('\n')[2]

        if (callSite) {
            args.push(callSite.trim())
        }

        originalWarn.apply(console, args)
    }
}
