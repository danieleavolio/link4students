<script>
	import Collegamento from './Collegamento.svelte';
	export let collegamentiUtente;
</script>

<div class="lista-collegamenti">
	{#each collegamentiUtente as collegamento(collegamento.id)}
		<div class="singolo-collegamento">
			<Collegamento {collegamento} />
		</div>
	{/each}
</div>

<style>
	.lista-collegamenti {
		height: 400px;
		overflow-y: scroll;
		margin: 1rem;
	}

	.lista-collegamenti::-webkit-scrollbar {
		display: none;
	}

	.singolo-collegamento {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	}
</style>
