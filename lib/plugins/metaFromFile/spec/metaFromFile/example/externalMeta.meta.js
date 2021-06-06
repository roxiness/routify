export default async () => ({
    prop: 'value',
    nested: {
        nestedProp: 'nestedValue',
    },
    'codesplitted|split': "I'm split",
    explicit: {
        value: "I'm explicit",
    },
    explicitSplit: {
        value: "I'm explicit and split",
        split: true,
    },
    explicitSplitCached: {
        value: () => "I'm explicit, split and cached" + new Date().toString(),
        split: true,
        cached: true,
    },
    explicitCached: {
        value: () => "I'm explicit and cached" + new Date().toString(),
        cached: true,
    },
})
