<script context="module">
    export const load = async ctx => {
        console.log('params', ctx.route.params)
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
    export let context
</script>

<article class="project">
    <div class="readme">
        {@html context.load.repo.readmeResolved}
    </div>
</article>

<style>
    article {
        position: absolute;
        top: 0;
        left: 200px;
        bottom: 0;
        right: 0;
        overflow: auto;
    }
</style>
