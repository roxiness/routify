<script context="module">
    export const load = ({ route }) => ({
        status: 404,
        error: '[Routify] Page could not be found.',
        props: { url: route.url },
    })

    const isDev = import.meta.env?.DEV
</script>

<script>
    export let url
</script>

<!-- routify:meta inline=false -->

<!-- This file was created by Routify.
     To customize the error page, create a catchall page 
     in the root of your project. Eg. [...404].svelte -->
<div class="four04">
    <h1>404 - Page Not Found</h1>
    <p>
        The page <code>{url}</code> could not be found. Please check the URL or go back to
        the <a href="/">homepage</a>.
    </p>
    {#if isDev}
        <div>
            <h5>Dev note:</h5>
            <ul>
                <li>
                    To customize this page, create a
                    <code>[...404].svelte</code> file in the root of your project.
                </li>
                <li>
                    You can copy this file from <code
                        >.routify/components/[...404].svelte</code
                    >.
                </li>
                <li>
                    Custom 404 files can be created at any level of your project. For
                    example, in <code>src/pages/blog/[...404].svelte</code>.
                </li>
            </ul>
        </div>
    {/if}
</div>

<style>
    div {
        display: flex;
        align-items: center;
        flex-direction: column;
        text-align: center;
    }
    div.four04 > * {
        margin-top: 1em;
    }

    ul {
        padding: 0;
    }
    ul li {
        opacity: 75%;
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
</style>
