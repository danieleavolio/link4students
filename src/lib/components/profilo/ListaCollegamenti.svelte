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
		margin: 1rem;
	}

	.lista-collegamenti::-webkit-scrollbar {
		display: none;
	}

	.singolo-collegamento {
		display: flex;
		gap: 0.5em;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
</style>
