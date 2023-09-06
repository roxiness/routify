<script context="module">
  export const load = async () => {
    const res = await fetch('http://localhost:3000/api/greeting')
    const data = await res.json()
    return { props: { data } }
  }
</script>

<script>
  export let data
</script>

<h3>
  Message from API: {data.msg}
</h3>
