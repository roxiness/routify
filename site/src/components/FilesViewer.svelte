<script>
    import Code from './Code.svelte'
    import { TabsPage, Tabs, TabsLink } from 'polykit'

    export let focus = ''
    export let root

    const files = []
    if (root.module) files.push({ node: root, level: 0 })

    const addFiles = (node, level = 0) => {
        node.children.forEach(node => {
            files.push({
                level,
                node,
                selected: node.file.base === focus,
            })
            addFiles(node, level + 1)
        })
    }
    addFiles(root)

    const langMap = {
        js: 'javascript',
        svelte: 'svelte',
        md: 'svelte',
    }
</script>

<Tabs>
    <div class="tabs">
        <div class="filetree">
            <div class="files-header">FILES</div>
            {#each files as file}
                <TabsLink selected={file.selected}>
                    <span style="padding-left: {file.level * 16}px">
                        {file.node.file.base}
                    </span>
                </TabsLink>
            {/each}
        </div>
        <div class="file">
            {#each files as file}
                <TabsPage>
                    <!-- <div class="files-header">{file.node.file.base}</div> -->
                    <div>
                        <Code language={langMap[file.node.file.base.split('.').pop()]}>
                            {file.node.meta.src}
                        </Code>
                    </div>
                </TabsPage>
            {/each}
        </div>
    </div>
</Tabs>

<style>
    .filetree {
        background: #fafafa !important;
    }
    .file {
        width: 100%;
    }
    .files-header {
        background: #999;
        color: #fff;
        font-weight: bold;
        font-size: 12px;
        padding-left: 24px;
        line-height: 32px;
        margin-bottom: 8px;
    }
    .filetree :global(button) {
        width: 100%;
        display: block;
        background: none !important;
        text-align: left;
        border: none !important;
        color: #606c76;
        text-transform: none;
        font-weight: normal;
        font-size: 12px;
        margin: 0;
        z-index: 0;
        position: relative;
        border-radius: 0;
        transform: translateY(1px);
        padding-left: 20px;
        width: 192px;
        height: 32px;
        line-height: 32px;
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
        background: #310541;
        display: flex;
    }
</style>
