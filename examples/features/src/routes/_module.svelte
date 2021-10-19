<script>
    import { node } from '@roxi/routify'
    import Navtree from '../components/Navtree.svelte'
</script>

<div class="container">
    <nav>
        <ul>
            <li>
                <h3>
                    <a href="/"> Routify 3- kitchensink </a>
                </h3>
            </li>
        </ul>
        <Navtree node={$node} />
    </nav>
    <slot />
</div>
