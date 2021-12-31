<script>
	import { db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';
import { domandeSegnalate } from '$lib/stores/domandeStore';
	import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import Domanda from '../utilities/Domanda.svelte';
	import ModalDomanda from '../utilities/ModalDomanda.svelte';
	import Vuoto from '../utilities/Vuoto.svelte';

	export let idCorso;

	let domande = [];
	let keywords = '';

	onMount(() => {
		// Realtime updates
		const queryDomande = query(collection(db, 'domande'), where('idCorso', '==', idCorso));
		const realTimeDomande = onSnapshot(queryDomande, (querySnapshot) => {
			domande = querySnapshot.docs;
		});

		// Prendo le recensioni segnalate per mostrare un testo alternativo all'utente che ha segnalato
		if ($authStore.isLoggedIn) {
			const queryDomande = query(
				collection(db, 'segnalazioniDomande'),
				where('idSegnalatore', '==', $authStore.user.uid)
			);
			getDocs(queryDomande).then((res) => {
				let listaSegnalazioni = [];
				res.docs.forEach((elem) => {
					listaSegnalazioni = [...listaSegnalazioni, elem.data()];
				});
				domandeSegnalate.update((oldReports) => listaSegnalazioni);
			});
		}
	});

	$: listaFiltrata = domande.filter((item) =>
		item.data().titolo.toLowerCase().includes(keywords.toLowerCase())
	);
</script>

<div class="container">
	<h1>Lista delle domande</h1>
	<!-- Se non ci sono domande -->

	<div class="utilities">
		<ModalDomanda {idCorso} />
		<div class="filtering">
			<span class="lente">🔎</span><input
				bind:value={keywords}
				class="filtro"
				type="text"
				placeholder="Filtro per titolo"
			/>
		</div>
	</div>
	{#if domande.length == 0}
		<Vuoto oggetti={'domande'} />
	{:else if keywords.length == 0}
		<div class="lista-domande">
			{#each domande as domanda (domanda.id)}
				<Domanda {domanda} />
			{/each}
		</div>
	{:else}
		<div class="lista-domande">
			{#each listaFiltrata as domanda (domanda.id)}
				<Domanda {domanda} />
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
		max-width: 80vw;
		width: 100%;
	}

	.lista-domande {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 1rem;
	}

	.utilities {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.filtering {
		border-radius: 10px;
		padding: 0.3rem;
		display: flex;
		align-items: center;
		box-shadow: 0 5px 5px rgb(0 0 0 / 40%);
	}

	.filtro {
		border: none;
		padding: 0.2rem;
		font-size: 1rem;
		outline: none;
		border: none;
	}
</style>
