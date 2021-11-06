<script context="module">
    export const load = async ctx => {
        const meta = [...ctx.route.fragments].pop().node.traverse('..').meta
        const project = ctx.route.params.project
        const repo = meta.repos.find(repo => repo.data.name === project)
        if (repo) {
            repo.readmeResolved = await repo.readme()
            return { repo }
        }
    }
</script>

<script>
    import { url } from '@roxi/routify'
    export let context
</script>

<article class="project">
    <div>
        {@html context.load.repo.readmeResolved}
    </div>
</article>
<a class="close" href={$url('../')}> <button> close </button></a>

<style>
    article {
        position: absolute;
        top: 0;
        left: 200px;
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
