<script>
	import { db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';
	import { recensioniSegnalate } from '$lib/stores/recensioniStore';
	import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import Recensione from '../utilities/Recensione.svelte';
	import Vuoto from '../utilities/Vuoto.svelte';

	export let idCorso;

	let recensioni = [];

	onMount(() => {
		// Realtime updates
		const queryRecensioni = query(collection(db, 'recensioni'), where('idCorso', '==', idCorso));
		const realTimeRecensioni = onSnapshot(queryRecensioni, (querySnapshot) => {
			recensioni = querySnapshot.docs;
		});

		// Prendo le recensioni segnalate per mostrare un testo alternativo all'utente che ha segnalato
		if ($authStore.isLoggedIn) {
			const querySegnalazioni = query(
				collection(db, 'segnalazioniRecensioni'),
				where('idSegnalatore', '==', $authStore.user.uid)
			);
			getDocs(querySegnalazioni).then((res) => {
				let listaSegnalazioni = [];
				res.docs.forEach((elem) => {
					listaSegnalazioni = [...listaSegnalazioni, elem.data()];
				});
				recensioniSegnalate.update((oldReports) => listaSegnalazioni);
			});
		}
	});
</script>

<div class="container">
	<h1>Lista delle recensioni</h1>

	{#if recensioni.length == 0}
		<Vuoto oggetti={'recensioni'} />
	{:else}
		<div class="lista-recensioni">
			{#each recensioni as recensione (recensione.id)}
				<Recensione {recensione} />
			{/each}
		</div>
	{/if}
</div>

<style>
	h1 {
		text-align: center;
	}
	.container {
		margin-bottom: 2rem;
		width: 100%;
	}

	.lista-recensioni {
		display: flex;
		gap: 1rem;
		margin: 1rem;
	}
</style>
