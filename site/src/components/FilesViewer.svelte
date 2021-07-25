<script>
    import Code from './Code.svelte'
    import { TabsPage, Tabs, TabsLink } from 'polykit'

    export let filesPromise
    export let files = []
    export let exclude = []
    export let include = []

    $: if (filesPromise) filesPromise.then(r => (files = r))

    const filesFilter = file =>
        !exclude.includes(file.name) && (!include.length || include.includes(file.name))

    $: filteredFiles = files.filter(filesFilter)

    const langMap = {
        js: 'javascript',
        svelte: 'svelte',
        md: 'svelte',
    }
</script>

<div class="tabs">
    <Tabs>
        {#each filteredFiles as file}
            <TabsLink>{file.name}</TabsLink>
        {/each}
        {#each filteredFiles as file}
            <TabsPage>
                <div>
                    <Code language={langMap[file.name.split('.').pop()]}
                        >{file.content}</Code>
                </div>
            </TabsPage>
        {/each}
    </Tabs>
</div>

<style>
    * :global(button) {
        background: none !important;
        border: none !important;
        color: #373c41;
        text-transform: none;
        font-weight: normal;
        font-size: 16px;
        background: #fafcff !important;
        margin: 0;
        z-index: 0;
        position: relative;
        border-radius: 0;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
        transform: translateY(1px);
    }
    * :global(button.selected) {
        color: #606c76;
        transform: translateY(0px);
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
        font-weight: bold;
        background: white !important;
        z-index: 10;
    }
    * :global(pre) {
        margin: 0;
        border-top-left-radius: 0;
    }
    .tabs {
        /* background: #fcfdff;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); */
    }
    * :global(.panel) {
        /* padding: 16px;
        background: white; */
    }
</style>
