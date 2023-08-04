<script>
    let cities = ['new-york', 'london', 'tokyo', 'sydney']
</script>

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
