<script context="module">
	import { db } from '$lib/firebaseConfig';
	import { collection, getDocs, limit, query, startAfter, where } from 'firebase/firestore';
	import { fly } from 'svelte/transition';

	export async function load({ page }) {
		let tipo = page.query.get('tipo') != null ? page.query.get('tipo') : '';
		let keyword = page.query.get('keyword') != null ? page.query.get('keyword') : '';
		let oldTipo = tipo;

		// NON RIESCO A TROVARE UN MODO PER FARE DELLE QUERY LEGGERE
		let lista = [];
		switch (tipo) {
			case 'utenti':
				const q = query(collection(db, 'users'), limit(10 * 10));
				await getDocs(q).then((results) => {
					lista = results.docs.filter((utente) =>
						utente.data().nome.toLowerCase().includes(keyword.toLowerCase())
					);
				});
				break;
			case 'corsi':
				const q2 = query(collection(db, 'corsidelcdl'), limit(10 * 10));
				await getDocs(q2).then((results) => {
					lista = results.docs.filter((corso) =>
						corso.data().nome.toLowerCase().includes(keyword.toLowerCase())
					);
				});

				break;
			case 'appunti':
				const q3 = query(collection(db, 'appunti'), limit(10 * 10));
				await getDocs(q3).then((results) => {
					lista = results.docs.filter((appunto) =>
						appunto.data().titoloAppunti.toLowerCase().includes(keyword.toLowerCase())
					);
				});
				break;
			default:
				break;
		}

		return {
			props: {
				tipo,
				keyword,
				lista,
				oldTipo
			}
		};
	}
</script>

<script lang="ts">
	import UtenteRicercato from '$lib/components/ricerca/UtenteRicercato.svelte';
	import AppuntoRicerca from '$lib/components/ricerca/AppuntoRicerca.svelte';
	import VuotoRicerca from '$lib/components/ricerca/VuotoRicerca.svelte';
	import CorsoRicerca from '$lib/components/ricerca/CorsoRicerca.svelte';

	export let tipo;
	export let keyword;
	export let lista;
	export let oldTipo;

	let listaAppunti;
	let listaUtenti;
	let listaCorsi;
	let oldKeyword = keyword;

	let noMoreRes = false;

	// Controllino
	if (tipo == null) tipo = 'utenti';

	// Per fare una ricerca in modo preciso, firebase non offre nessun servizio. Siccome ci sono 45 cubi + 2 dipartimenti per cubo circa
	// contando triennale e magistrale con 20 corsi ognuno, ci sono circa 3600 corsi
	//Stimando le query, le eseguo.

	let searchBar;
	/**
	 * La variabile aiuta a definire il range di risultati di query da analizzare, per evitare attese infinite
	 * in caso di un numero di query eccessivamente grande.
	 */
	let limiteRicerca;

	/**
	 * In base @var tipo si sceglie che tipo di ricerca fare.
	 * Viene fatta una chiamata nel submit del form e successivamente vengono filtrati i risultati
	 * Se la parola chiave è contenuta all'interno della stringa apposita del risultato, rimane nella lista di risultati
	 * altrimenti viene scartata
	 */
	const handleRicerca = () => {
		keyword = keyword.trim();
		if (keyword.length >= 3) {
			noMoreRes = false;
			switch (tipo) {
				case 'utenti':
					ricercaByUtenti();
					oldKeyword = keyword;
					break;
				case 'corsi':
					ricercaByCorsi();
					oldKeyword = keyword;

					break;
				case 'appunti':
					ricercaByAppunti();
					oldKeyword = keyword;
					break;
				default:
					break;
			}
		}
	};

	const ricercaByCorsi = async () => {
		if (keyword != oldKeyword || oldTipo != 'corsi') {
			// Limito il numero di risultati a 10
			const queryCorsi = query(collection(db, 'corsidelcdl'), limit(limiteRicerca * 10));
			await getDocs(queryCorsi).then((corsi) => {
				listaCorsi = corsi.docs;
				listaCorsi = listaCorsi.filter((elem) =>
					elem.data().nome.toLowerCase().includes(keyword.toLowerCase())
				);
			});
			lista = listaCorsi;
			oldTipo = 'corsi';
		}
	};

	const ricercaByUtenti = async () => {
		if (keyword != oldKeyword || oldTipo != 'utenti') {
			const q = query(collection(db, 'users'), limit(limiteRicerca * 10));
			await getDocs(q).then((results) => {
				listaUtenti = results.docs.filter((utente) =>
					utente.data().nome.toLowerCase().includes(keyword.toLowerCase())
				);
			});
			lista = listaUtenti;
			oldTipo = 'utenti';
		}
	};

	const ricercaByAppunti = async () => {
		if (keyword != oldKeyword || oldTipo != 'appunti') {
			const queryCorsi = query(collection(db, 'appunti'), limit(limiteRicerca * 10));
			await getDocs(queryCorsi).then((appunti) => {
				listaAppunti = appunti.docs;
				listaAppunti = listaAppunti.filter((elem) =>
					elem.data().titoloAppunti.toLowerCase().includes(keyword.toLowerCase())
				);
			});
			lista = listaAppunti;
			oldTipo = 'appunti';
		}
	};

	const loadMoreCorsi = async () => {
		let lenLista = lista.length;
		switch (tipo) {
			case 'utenti':
				const more1 = query(collection(db, 'users'), startAfter(lista[lista.length - 1]));
				await getDocs(more1).then((nuovi) => {
					let nuovaLista = nuovi.docs;
					nuovaLista = nuovaLista.filter((elem) =>
						elem.data().nome.toLowerCase().includes(oldKeyword.toLowerCase())
					);
					// Copio ogni nuovo elemento 1 alla volta
					nuovaLista.forEach((elem) => {
						lista = [...lista, elem];
					});
				});
				break;
			case 'corsi':
				const more2 = query(collection(db, 'corsidelcdl'), startAfter(lista[lista.length - 1]));
				await getDocs(more2).then((nuovi) => {
					let nuovaLista = nuovi.docs;
					nuovaLista = nuovaLista.filter((elem) =>
						elem.data().nome.toLowerCase().includes(oldKeyword.toLowerCase())
					);
					// Copio ogni nuovo elemento 1 alla volta
					nuovaLista.forEach((elem) => {
						lista = [...lista, elem];
					});
				});
				break;
			case 'appunti':
				const more3 = query(collection(db, 'appunti'), startAfter(lista[lista.length - 1]));
				await getDocs(more3).then((nuovi) => {
					let nuovaLista = nuovi.docs;
					nuovaLista = nuovaLista.filter((elem) =>
						elem.data().titoloAppunti.toLowerCase().includes(oldKeyword.toLowerCase())
					);
					// Copio ogni nuovo elemento 1 alla volta
					nuovaLista.forEach((elem) => {
						lista = [...lista, elem];
					});
				});

				break;
			default:
				break;
		}
		if (lista.length == lenLista) noMoreRes = true;
	};

	let classeUtenti = '';
	let classeCorsi = '';
	let classeAppunti = '';

	// Gestione UI scelta
	$: if (tipo == 'utenti') {
		classeUtenti = 'attiva';
		classeCorsi = '';
		classeAppunti = '';
		ricercaByUtenti();
	} else if (tipo == 'corsi') {
		classeUtenti = '';
		classeCorsi = 'attiva';
		classeAppunti = '';
		ricercaByCorsi();
	} else if (tipo == 'appunti') {
		classeUtenti = '';
		classeCorsi = '';
		classeAppunti = 'attiva';
		ricercaByAppunti();
	}
</script>

<svelte:head>
	<title>Pagina di ricerca</title>
</svelte:head>
<h1>Pagina ricerca</h1>
<div class="container-ricerca">
	<div class="top-bar">
		<form on:submit|preventDefault={handleRicerca} action="">
			<select bind:value={limiteRicerca} name="range" id="range">
				<option value="10">10</option>
				<option value="50">50</option>
				<option value="100">+100</option>
			</select>
			<span class="material-icons"> search </span><input
				bind:this={searchBar}
				type="text"
				bind:value={keyword}
				min="2"
				placeholder="Minimo 3 caratteri"
				required
			/>
			<div class="filtro">
				<button type="button" on:click={() => (tipo = 'utenti')} class="selezione {classeUtenti}">
					<span class="material-icons"> person </span>
				</button>
				<button type="button" on:click={() => (tipo = 'corsi')} class="selezione {classeCorsi}">
					<span class="material-icons"> school </span>
				</button>
				<button type="button" on:click={() => (tipo = 'appunti')} class="selezione {classeAppunti}">
					<span class="material-icons"> edit </span>
				</button>
			</div>
		</form>
	</div>
	<!-- Lista risultati -->
	<div class="lista-risultati">
		{#if lista.length > 0}
			{#if oldTipo == 'utenti'}
				{#each lista as utente}
					<UtenteRicercato {utente} />
				{/each}
			{:else if oldTipo == 'corsi'}
				{#each lista as corso}
					<CorsoRicerca {corso} />
				{/each}
			{:else if oldTipo == 'appunti'}
				{#each lista as appunto}
					<AppuntoRicerca {appunto} />
				{/each}
			{/if}
			{#if !noMoreRes}
				<button transition:fly on:click={loadMoreCorsi} class="carica-altri selezione"
					>Carica altri..</button
				>
			{/if}
		{:else}
			<VuotoRicerca />
		{/if}
	</div>
</div>

<style>
	input {
		font-size: 1.3em;
		outline: none;
	}
	.container-ricerca {
		width: 90%;
		display: flex;
		flex-direction: column;
		box-shadow: var(--innerNeu);
		justify-content: center;
		align-items: center;
		border-radius: 1rem;
		font-weight: 600;
	}

	.top-bar {
		display: flex;
		gap: 1rem;
		padding: 1rem;
	}

	select {
		background-color: var(--sfondo);
		outline: none;
		border: var(--bordo);
		border-radius: 0.5rem;
		box-shadow: var(--innerNeu);
		font-size: 1.3em;
	}
	.selezione {
		font-size: 1.5em;
		border: none;
		box-shadow: var(--neumorphism);
		padding: 1rem;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: var(--velocita);
		font-weight: 600;
	}
	.selezione:hover {
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}

	form {
		width: 100%;
		display: flex;
		gap: 1rem;
		padding: 1rem;
	}

	span {
		align-self: center;
		font-size: 1.5em;
	}

	.attiva {
		box-shadow: var(--innerNeu);
	}

	.filtro {
		display: flex;
		gap: 1rem;
	}

	.lista-risultati {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		justify-content: center;
		align-items: center;
	}
	.carica-altri {
		background-color: var(--submit);
		font-size: 1.3rem;
		padding: 0.2rem;
		color: white;
		margin: 1rem;
		box-shadow: var(--neumorphism);
	}

	.carica-altri:hover {
		box-shadow: var(--submitHover);
	}
</style>
