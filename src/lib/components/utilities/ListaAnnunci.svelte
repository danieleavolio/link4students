<script>
	import { onMount } from 'svelte';

	import AnnuncioDash from '../dashboard/AnnuncioDash.svelte';

	export let annunci;
	export let modificando;

	let ascendente = false;

	// onMount(() => {
	// 	annunci = annunci.sort((a, b) => a.data().data.localeCompare(b.data().data));
	// });

	$: if (ascendente) {
		annunci = annunci.sort((a, b) => a.data().data - b.data().data);
	} else {
		annunci = annunci.sort((a, b) => b.data().data - a.data().data);
	}
</script>

<button class="sort" on:click={() => (ascendente = !ascendente)}
	>{ascendente == true ? 'Ascendente' : 'Discendente'}</button
>
<div class="lista-annunci">
	{#each annunci as annuncio (annuncio.id)}
		<AnnuncioDash {annuncio} bind:modificando />
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

	.sort {
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
		width: fit-content;
		font-size: 1.3em;
		align-self: flex-end;
		border-radius: 0.3em;
	}
</style>
