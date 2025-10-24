<script>
    let cities = ['new-york', 'london', 'tokyo', 'sydney']
</script>

<!-- routify:_meta _description="<pre><code>let params = {<br>  city = ['new-york', 'london'...]<br>...<br>slot inline={{ params }}</code></pre>   " -->
<!-- routify:meta _description="Using <code>&lt;slot inline={{params}} /&gt;</code>, we can pass 4 city names. This will create 4 instances of <code>inline-params/[city]</code>." -->

<div class="city-box">
    <slot inline={{ params: { city: [...cities] } }} />
</div>

<style>
    .city-box {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 1rem;
        margin-inline: 1rem;
        margin-top: 1rem;
    }
</style>
