export default async function () {
    await new Promise(resolve => setTimeout(resolve, 1))
    return {
        asyncData: 'Im async',
        'asyncDataSplit|split': 'Im async split' + 1 + 2 + 3,
    }
}
