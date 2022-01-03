<script>
import Collegamento from "./Collegamento.svelte";


    export let collegamenti;
</script>


<div class="lista-collegamenti">
    {#each collegamenti as collegamento}
        <Collegamento {collegamento}></Collegamento>
    {/each}
</div>


<style>
    .lista-collegamenti{
        width: 80%;
        height: 400px;
        overflow-y: scroll;
        margin: auto;
    }

    .lista-collegamenti::-webkit-scrollbar{
        display: none;
    }
</style>