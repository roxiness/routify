<script>
    import {goto, leftover} from '@sveltech/routify'
    $goto('../../v1/'+$leftover, null, true, true)
</script>