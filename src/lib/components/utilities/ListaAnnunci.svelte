<script>

	import AnnuncioDash from '../dashboard/AnnuncioDash.svelte';
	import Loading from './Loading.svelte';

	export let annunci;
	export let modificando;
	import { fly } from "svelte/transition";

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

{#if annunci.length > 0}
	<button class="sort" on:click={() => (ascendente = !ascendente)}
		>{!ascendente ? 'Crescente' : 'Decrescente'}</button
	>
	<div class="lista-annunci" transition:fly|local>
		{#each annunci as annuncio (annuncio.id)}
			<AnnuncioDash {annuncio} bind:modificando />
		{/each}
	</div>
{:else}
	<Loading />
{/if}

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
