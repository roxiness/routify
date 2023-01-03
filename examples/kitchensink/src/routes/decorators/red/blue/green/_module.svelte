<script>
    import Green from '../../../__decorators/Green.svelte'
    // By using an anonymous callback we can reset decorators
    const decorator = parentDecorators => [Green]
</script>

Green (reset decorators and apply green border to each child component)
<slot {decorator} />
