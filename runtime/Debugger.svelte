<script>
    export let instance
    const { urlStore } = instance
</script>

<pre>
    <!-- {JSON.stringify(instance, null, 2)} -->
</pre>

<div>
    <strong>urlStore:</strong>
    {$urlStore}
</div>

<style>
    div {
        position: absolute;
        height: 30px;
        line-height: 30px;
        background: #eee;
        width: 100%;
        top: 0;
        left: 0;
        padding: 0 16px;
    }
</style>
