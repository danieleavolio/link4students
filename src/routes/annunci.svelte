<script lang="ts">
	import ListaAnnunci from '$lib/components/utilities/ListaAnnunci.svelte';
	import { db } from '$lib/firebaseConfig';

	import { collection, getDocs, limit, onSnapshot, query } from 'firebase/firestore';
	import { onMount } from 'svelte';

	let limite = 2;
	let annunci = [];
	let isMoreThanLimit = false;
	let queryAnnunci = query(collection(db, 'annunci'), limit(limite));
	let loaded = false;
	let loadMore = false;

	onMount(() => {
		onSnapshot(queryAnnunci, (lista) => {
			annunci = lista.docs;
			if (annunci.length == limite) {
				isMoreThanLimit = true;
			}
			loaded = true;
		});
	});

	const aumentaLimite = async () => {
		limite = limite * 2;
		queryAnnunci = query(collection(db, 'annunci'), limit(limite));
		await getDocs(queryAnnunci).then((annuncis) => {
			annunci = annuncis.docs;
		});

		if (annunci.length == limite) {
			isMoreThanLimit = true;
		} else {
			isMoreThanLimit = false;
		}
	};
</script>

<h1>Pagina degli annunci</h1>

{#if !loaded}
	<div class="loading" />
{:else}
	<ListaAnnunci bind:annunci modificando={false} />
	{#if isMoreThanLimit}
		<button
			on:mouseleave={() => (loadMore = false)}
			on:mouseenter={() => (loadMore = true)}
			class="aumenta"
			on:click={aumentaLimite}
			>Altri {#if loadMore}
				<span class="loading2" />
			{/if}
		</button>
	{/if}
{/if}

<style>
	.loading {
		border: var(--testo) solid 10px;
		width: 50px;
		height: 50px;
		border-top: var(--sfondo) solid 10px;
		animation: loading 1s linear infinite;
		border-radius: 100%;
	}

	.loading2 {
		border: var(--testo) solid 5px;
		width: 5px;
		height: 5px;
		border-top: var(--sfondo) solid 5px;
		animation: loading 1s linear infinite;
		border-radius: 100%;
	}

	@keyframes loading {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.aumenta {
		margin: 2rem;
		font-size: 1.2rem;
		border-radius: 0.5rem;
		padding: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		transition: all 0.5s ease;
		cursor: pointer;
	}
</style>
