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
})
