<script>
	import AnnuncioDash from '../dashboard/AnnuncioDash.svelte';

	export let annunci;
</script>

<div class="lista-annunci">
	{#each annunci as annuncio (annuncio.id)}
		<AnnuncioDash {annuncio} />
	{/each}
</div>

<style>
	.lista-annunci {
		display: flex;
		gap: 1.3rem;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}
</style>
