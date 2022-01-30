export default function () {
    return {
        plain: 'Im plain',
        function: () => 'Im a function',
        'scopedPlain|scoped': 'Im scoped',
        'scopedSplitPlain|scoped|split': 'Im scoped split',
        'scopedFunction|scoped': () => 'Im a scoped function',
        'scopedSplitFunction|scoped|split': () => 'Im a scoped split function',
        'overwritten|scoped': 'original',
    }
}
