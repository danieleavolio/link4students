<script lang="ts">
	import ListaAnnunci from '$lib/components/utilities/ListaAnnunci.svelte';
	import { db } from '$lib/firebaseConfig';

	import { collection, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { onMount } from 'svelte';

	let limite = 2;
	let annunci = [];
	let isMoreThanLimit = false;
	let queryAnnunci = query(collection(db, 'annunci'), limit(limite), orderBy('data', 'desc'));
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
			>Altri
			<span class="material-icons">
				expand_more
				</span>
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

	@keyframes loading {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(1.3);
		}
	}
	.material-icons:hover{
		animation: loading 0.5s alternate infinite;
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
