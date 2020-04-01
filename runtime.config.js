export default {
    queryHandler: {
        parse: search => Object.fromEntries(new URLSearchParams(search)),
        stringify: params => '?'+(new URLSearchParams(params)).toString()
    }
}