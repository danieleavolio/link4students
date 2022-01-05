<script context="module">
	import { db } from '$lib/firebaseConfig';

	import { collection, getDocs, limit, query, startAfter } from 'firebase/firestore';
	import { fly } from 'svelte/transition';

	export async function load({ page }) {
		let tipo = page.query.get('tipo');
		let keyword = page.query.get('keyword');

		// NON RIESCO A TROVARE UN MODO PER FARE DELLE QUERY LEGGERE OK?
		let lista = [];

		switch (tipo) {
			case 'utenti':
				const q = query(collection(db, 'users'), limit(10));
				await getDocs(q).then((results) => {
					lista = results.docs.filter((utente) =>
						utente.data().nome.toLowerCase().includes(keyword.toLowerCase())
					);
				});
				break;
			case 'corsi':
				const q2 = query(collection(db, 'corsidelcdl'), limit(10));
				await getDocs(q2).then((results) => {
					lista = results.docs.filter((corso) =>
						corso.data().nome.toLowerCase().includes(keyword.toLowerCase())
					);
				});
				break;
			case 'appunti':
				const q3 = query(collection(db, 'appunti'), limit(10));
				await getDocs(q3).then((results) => {
					lista = results.docs.filter((appunto) =>
						appunto.data().titoloAppunti.toLowerCase().includes(keyword.toLowerCase())
					);
				});
				break;
		}

		return {
			props: {
				tipo,
				keyword,
				lista
			}
		};
	}
</script>

<script lang="ts">
	import UtenteRicercato from '$lib/components/ricerca/UtenteRicercato.svelte';
	import CorsoRicercato from '$lib/components/ricerca/corsoRicercato.svelte';
	import AppuntoRicerca from '$lib/components/ricerca/AppuntoRicerca.svelte';
	import VuotoRicerca from '$lib/components/ricerca/VuotoRicerca.svelte';
	import CorsoRicerca from '$lib/components/ricerca/CorsoRicerca.svelte';

	export let tipo;
	export let keyword;
	export let lista;

	let listaAppunti;
	let listaUtenti;
	let listaCorsi;
	let oldKeyword = keyword;
	let messaggio = '';
	let oldTipo = tipo;

	let noMoreRes = false;

	let searchBar;
	/**
	 * La variabile aiuta a definire il range di risultati di query da analizzare, per evitare attese infinite
	 * in caso di un numero di query eccessivamente grande.
	 */
	let limiteRicerca = 10;
	const handleSearchBarRepetition = () => {
		searchBar.style = 'outline: solid red';
	};

	const resetSearchBar = () => {
		searchBar.style = 'outline: none';
	};

	/**
	 * In base @var tipo si sceglie che tipo di ricerca fare.
	 * Viene fatta una chiamata nel submit del form e successivamente vengono filtrati i risultati
	 * Se la parola chiave è contenuta all'interno della stringa apposita del risultato, rimane nella lista di risultati
	 * altrimenti viene scartata
	 */
	const handleRicerca = () => {
		keyword = keyword.trim();
		if (keyword.length > 3) {
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
			const queryCorsi = query(collection(db, 'corsidelcdl'), limit(limiteRicerca));
			await getDocs(queryCorsi).then((corsi) => {
				listaCorsi = corsi.docs;
				listaCorsi = listaCorsi.filter((elem) =>
					elem.data().nome.toLowerCase().includes(keyword.toLowerCase())
				);
			});
			lista = listaCorsi;
			oldTipo = 'corsi';
		} else handleSearchBarRepetition();
	};

	const ricercaByUtenti = async () => {
		if (keyword != oldKeyword || oldTipo != 'utenti') {
			const q = query(collection(db, 'users'), limit(limiteRicerca));
			await getDocs(q).then((results) => {
				listaUtenti = results.docs.filter((utente) =>
					utente.data().nome.toLowerCase().includes(keyword.toLowerCase())
				);
			});
			lista = listaUtenti;
			oldTipo = 'utenti';
		} else handleSearchBarRepetition();
	};

	const ricercaByAppunti = async () => {
		if (keyword != oldKeyword || oldTipo != 'appunti') {
			const queryCorsi = query(collection(db, 'appunti'), limit(limiteRicerca));
			await getDocs(queryCorsi).then((appunti) => {
				listaAppunti = appunti.docs;
				listaAppunti = listaAppunti.filter((elem) =>
					elem.data().titoloAppunti.toLowerCase().includes(keyword.toLowerCase())
				);
			});
			lista = listaAppunti;
			oldTipo = 'appunti';
		} else handleSearchBarRepetition();
	};

	const loadMoreCorsi = async () => {
		let lenLista = lista.length;
		switch (tipo) {
			case 'utenti':
				const more1 = query(collection(db, 'users'), startAfter(lista[lista.length - 1]));
				await getDocs(more1).then((nuovi) => {
					let nuovaLista = nuovi.docs;
					nuovaLista = nuovaLista.filter((elem) =>
						elem.data().nome.toLowerCase().includes(keyword.toLowerCase())
					);
					// Copio ogni nuovo elemento 1 alla volta
					nuovaLista.forEach((elem) => {
						lista = [...lista, elem];
					});
				});
				oldKeyword = keyword;
				break;
			case 'corsi':
				const more2 = query(collection(db, 'corsidelcdl'), startAfter(lista[lista.length - 1]));
				await getDocs(more2).then((nuovi) => {
					let nuovaLista = nuovi.docs;
					nuovaLista = nuovaLista.filter((elem) =>
						elem.data().nome.toLowerCase().includes(keyword.toLowerCase())
					);
					// Copio ogni nuovo elemento 1 alla volta
					nuovaLista.forEach((elem) => {
						lista = [...lista, elem];
					});
				});
				oldKeyword = keyword;
				break;
			case 'appunti':
				const more3 = query(collection(db, 'appunti'), startAfter(lista[lista.length - 1]));
				await getDocs(more3).then((nuovi) => {
					let nuovaLista = nuovi.docs;
					nuovaLista = nuovaLista.filter((elem) =>
						elem.data().titoloAppunti.toLowerCase().includes(keyword.toLowerCase())
					);
					// Copio ogni nuovo elemento 1 alla volta
					nuovaLista.forEach((elem) => {
						lista = [...lista, elem];
					});
				});
				oldKeyword = keyword;

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
	} else if (tipo == 'corsi') {
		classeUtenti = '';
		classeCorsi = 'attiva';
		classeAppunti = '';
	} else if (tipo == 'appunti') {
		classeUtenti = '';
		classeCorsi = '';
		classeAppunti = 'attiva';
	}
</script>

<svelte:head>
	<title>Pagina di ricerca</title>
</svelte:head>
<div class="container-ricerca">
	<div class="top-bar">
		<form on:submit|preventDefault={handleRicerca} action="">
			<span>🔎</span><input
				bind:this={searchBar}
				type="text"
				bind:value={keyword}
				on:input={resetSearchBar}
				min="3"
				required
			/>
			<div class="filtro">
				<button type="button" on:click={() => (tipo = 'utenti')} class="selezione {classeUtenti}">
					👤
				</button>
				<button type="button" on:click={() => (tipo = 'corsi')} class="selezione {classeCorsi}">
					🎓
				</button>
				<button type="button" on:click={() => (tipo = 'appunti')} class="selezione {classeAppunti}">
					✒️
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
		font-size: 1rem;
		outline: none;
	}
	.container-ricerca {
		width: 90%;
		display: flex;
		flex-direction: column;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
		justify-content: center;
		align-items: center;
		border-radius: 0.4rem;
	}

	.top-bar {
		display: flex;
		gap: 1rem;
		padding: 1rem;
	}

	.selezione {
		font-size: 1rem;
		border: none;
		background-color: rgb(207, 207, 207);
		padding: 1rem;
		border-radius: 0.5rem;
		cursor: pointer;
	}

	form {
		width: 100%;
		display: flex;
		gap: 1rem;
		padding: 1rem;
	}

	span{
		align-self: center;
	}

	.attiva {
		background-color: blueviolet;
	}

	.lista-risultati {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.carica-altri {
		background-color: blueviolet;
		font-size: 1.3rem;
		padding: 0.2rem;
		color: white;
		margin: 1rem;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
	}
</style>
