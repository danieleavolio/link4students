<script>
	import ListaAnnunci from '$lib/components/utilities/ListaAnnunci.svelte';
	import { db } from '$lib/firebaseConfig';

	import { collection, getDocs, limit, onSnapshot, query } from 'firebase/firestore';
	import { onMount } from 'svelte';

	let limite = 2;
	let annunci = [];
	let isMoreThanLimit = false;
	let queryAnnunci = query(collection(db, 'annunci'), limit(limite));
	let loaded = false;

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
	<div  class="loading" />
{:else}
	<ListaAnnunci bind:annunci />
	{#if isMoreThanLimit}
		<button class="aumenta" on:click={aumentaLimite}>aumenta</button>
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
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

    .aumenta{
        margin: 2rem;
    }
</style>
