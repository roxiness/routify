<script>
    export let router
    const urlHook = [
        { name: 'address' },
        { name: 'internal' },
        { name: 'localStorage' },
    ]
    console.log({ router })
</script>

<div class="options">
    <div class="cog">⚙</div>
    <ul class="menu">
        <li>address</li>
        <li>internal</li>
        <li>localStorage</li>
    </ul>
</div>

<style>
    .options {
        position: absolute;
        top: 4px;
        right: 8px;
    }
    .menu {
        position: absolute;
        right: 0;
        background: white;
        box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.02);
        padding: 8px 20px;
        list-style: none;
        border-radius: 4px;
    }
</style>
