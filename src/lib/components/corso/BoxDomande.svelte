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
			<span class="material-icons">search</span><input
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
	{:else if listaFiltrata.length > 0}
		<div class="lista-domande">
			{#each listaFiltrata as domanda (domanda.id)}
				<Domanda {domanda} />
			{/each}
		</div>
	{:else}
		<Vuoto oggetti='domande con questo titolo'/>
	{/if}
</div>

<style>
	h1 {
		text-align: center;
	}
	.container {
		margin-bottom: 2rem;
		width: 80vw;
		
	}

	.lista-domande {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin: 1rem;
		justify-content: center;
		align-items: center;
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
		box-shadow: var(--neumorphism);
	}

	.filtro {
		border: none;
		padding: 0.2rem;
		font-size: 1.3em;
		outline: none;
		border: none;
	}

	@media screen and (max-width:450px){
		.utilities{
			display: grid;
			grid-template-columns: 1fr;
			place-items: center;
		}

		.filtering{
			font-size: 0.8em;
			width: 80%;
		}

		.filtro{
			width: 100%;
		}
		
	}
	
</style>
