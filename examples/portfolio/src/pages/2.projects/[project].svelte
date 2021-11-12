<script context="module">
    export const load = async ({ route, node }) => {
        const { meta } = node.traverse('..')
        const { project } = route.params
        const repo = meta.repos.find(repo => repo.data.name === project)
        // await new Promise(resolve => setTimeout(resolve, 500))
        if (repo)
            return {
                readme: await repo.readme(),
            }
    }
</script>

<script>
    import { url } from '@roxi/routify'    
    export let context
</script>

<article class="project">
    <div>
        {@html context.load.readme}
    </div>
</article>
<a class="close" href={$url('../')}> <button> close </button></a>

<style>
    article {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow: auto;
    }
    .close {
        position: absolute;
        top: 56px;
        right: 32px;
        display: inline-block;
    }
</style>
