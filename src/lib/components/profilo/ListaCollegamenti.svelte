<script>

	import Collegamento from './Collegamento.svelte';
	export let collegamentiUtente;
</script>

<div class="lista-collegamenti">
	<div class="singolo-collegamento">
		{#each collegamentiUtente as collegamento}
			<Collegamento {collegamento} />
		{/each}
	</div>
</div>

<style>
	.lista-collegamenti {
		width: 80%;
		height: 400px;
		overflow-y: scroll;
		margin: auto;
	}

	.lista-collegamenti::-webkit-scrollbar {
		display: none;
	}

    .singolo-collegamento{
        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: center;
    }
    
</style>
