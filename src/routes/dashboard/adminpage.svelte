<script context="module">
	export async function load() {
		// Prendo la lista di utenti

		let utentiGenerali = [];
		const queryUtenti = query(collection(db, 'users'));

		await getDocs(queryUtenti).then((utenti) => {
			utentiGenerali = utenti.docs;
		});

		return {
			props: { utentiGenerali }
		};
	}
</script>

<script>
	import AppuntoDash from '$lib/components/dashboard/AppuntoDash.svelte';
	import BoxSelezioneAzione from '$lib/components/dashboard/BoxSelezioneAzione.svelte';
	import DomandaDash from '$lib/components/dashboard/DomandaDash.svelte';
	import RecensioneDash from '$lib/components/dashboard/RecensioneDash.svelte';
	import UtenteDash from '$lib/components/dashboard/UtenteDash.svelte';
	import VuotoDash from '$lib/components/dashboard/VuotoDash.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import { db } from '$lib/firebaseConfig';
	import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
	import ListaUtentiDash from '$lib/components/dashboard/stats/ListaUtentiDash.svelte';
	import UltimeAttivita from '$lib/components/dashboard/stats/UltimeAttivita.svelte';
	import Loading from '$lib/components/utilities/Loading.svelte';
	import CheckEverything from '$lib/components/dashboard/checkEverything.svelte';

	let user;
	let schermata = 'utenti';
	export let utentiGenerali;

	// Tutto quello che va mostrato qui
	let listaDomande = [];
	let listaUtenti = [];
	let listaRecensioni = [];
	let listaAppunti = [];


	onMount(async () => {
		if ($authStore.isLoggedIn) {
			await getDoc(doc(db, 'users', $authStore.user.uid)).then((doc) => {
				user = doc;
			});
		} else {
			goto('/');
		}
	});

	const clickDomande = () => {
		schermata = 'domande';
		if (listaDomande.length == 0) {
			const queryDomande = query(collection(db, 'segnalazioniDomande'));
			const realTimeDomande = onSnapshot(queryDomande, (querySnapshot) => {
				let tempList = [];
				querySnapshot.docs.forEach((elem) => {
					getDoc(doc(db, 'domande', elem.data().idDomanda)).then((docum) => {
						tempList.push({
							segnalazione: elem,
							domanda: docum
						});
						listaDomande = tempList;
					});
				});
			});
		}
	};

	const clickUtenti = () => {
		schermata = 'utenti';
		if (listaUtenti.length == 0) {
			const queryUtenti = query(collection(db, 'segnalazioniUtenti'));
			const realTimeUtenti = onSnapshot(queryUtenti, (querySnapshot) => {
				let tempList = [];
				querySnapshot.docs.forEach((elem) => {
					getDoc(doc(db, 'users', elem.data().idSegnalato)).then((docum) => {
						tempList.push({
							segnalazione: elem,
							utente: docum
						});
						listaUtenti = tempList;
					});
				});
			});
		}
	};

	const clickRecensioni = () => {
		schermata = 'recensioni';

		if (listaRecensioni.length == 0) {
			const querySegnalazioni = query(collection(db, 'segnalazioniRecensioni'));
			const realTimeSegnalazioni = onSnapshot(querySegnalazioni, (querySnapshot) => {
				let tempList = [];
				querySnapshot.docs.forEach((elem) => {
					getDoc(doc(db, 'recensioni', elem.data().idRecensione)).then((docum) => {
						if (docum.exists()) {
							tempList.push({
								segnalazione: elem,
								recensione: docum
							});
						}
						listaRecensioni = tempList;
					});
				});
			});
		}
	};

	const clickAppunti = () => {
		schermata = 'appunti';

		// Prendo solo gli appunti da revisionare
		if (listaAppunti.length == 0) {
			const queryAppunti = query(collection(db, 'appunti'), where('revisionato', '==', false));
			const realTimeAppunti = onSnapshot(queryAppunti, (querySnapshot) => {
				listaAppunti = querySnapshot.docs;
			});
		}
	};

	// Insicuro sul funzionamento
	const cambiaRecensioniSegnalate = (idRecensione) => {
		// Quando elimino una recensione, tolgo dalla lista locale tutte le segnalazioni di quella recensione
		listaRecensioni = listaRecensioni.filter((elem) => elem.recensione.id != idRecensione);
	};

	const cambiaUtentiSegnalati = (idSegnalazione) => {
		listaUtenti = listaUtenti.filter((elem) => elem.segnalazione.id != idSegnalazione);
	};

	const cambiaDomandeSegnalate = (idDomanda) => {
		listaDomande = listaDomande.filter((elem) => elem.domanda.id != idDomanda);
	};

	// Quando una recensione viene risolta, viene rimossa dalla UI
	const risolviRecensione = (idSegnalazione) => {
		listaRecensioni = listaRecensioni.filter((elem) => elem.segnalazione.id != idSegnalazione);
	};

	//Cancella la segnalazione dell'utente
	const risolviSegnalazioneUtente = (idSegnalazione) => {
		listaUtenti = listaUtenti.filter((elem) => elem.segnalazione.id != idSegnalazione);
	};

	//Cancella la segnalazione della domanda

	const risolviSegnalazioneDomanda = (idSegnalazione) => {
		listaDomande = listaDomande.filter((elem) => elem.segnalazione.id != idSegnalazione);
	};

	onMount(() => {
		clickUtenti();
	});
</script>

<svelte:head>
	<title>Admin dashboard</title>
</svelte:head>
<div class="dashboard">
	{#if $authStore.isLoggedIn}
		{#if user != null && $authStore.isAdmin}
			<h2>Benvenuto amministratore</h2>
			<div class="prima-sezione">
				<div class="prima-sinistra">
					<div class="lista-schermate">
						<p>Lista schermate</p>
						<button on:click={clickUtenti} class="bottone {schermata == 'utenti' ? 'attiva' : ''}"
							>Utenti</button
						>
						<button
							on:click={clickRecensioni}
							class="bottone {schermata == 'recensioni' ? 'attiva' : ''}">Recensioni</button
						>
						<button on:click={clickDomande} class="bottone {schermata == 'domande' ? 'attiva' : ''}"
							>Domande</button
						>
						<button on:click={clickAppunti} class="bottone {schermata == 'appunti' ? 'attiva' : ''}"
							>Appunti</button
						>
					</div>
				</div>
				<div class="prima-destra">
					<div class="schermata-selezionata">
						{#if schermata == 'utenti'}
							<p class="selezionato">Segnalazioni {schermata}</p>
							{#if listaUtenti.length == 0}
								<VuotoDash oggetti="utenti" />
							{:else}
								<div class="lista-generica">
									{#each listaUtenti as oggettoSegnalazione (oggettoSegnalazione.segnalazione.id)}
										<UtenteDash
											{oggettoSegnalazione}
											{cambiaUtentiSegnalati}
											{risolviSegnalazioneUtente}
										/>
									{/each}
								</div>
							{/if}
						{:else if schermata == 'recensioni'}
							<p class="selezionato">Segnalazioni {schermata}</p>
							{#if listaRecensioni.length == 0}
								<VuotoDash oggetti="recensioni" />
							{:else}
								<div class="lista-generica">
									{#each listaRecensioni as oggettoSegnalazione (oggettoSegnalazione.segnalazione.id)}
										<RecensioneDash
											{oggettoSegnalazione}
											{cambiaRecensioniSegnalate}
											{risolviRecensione}
										/>{/each}
								</div>
							{/if}
						{:else if schermata == 'domande'}
							<p class="selezionato">{schermata} da visionare</p>
							{#if listaDomande.length == 0}
								<VuotoDash oggetti="domande" />
							{:else}
								<div class="lista-generica">
									{#each listaDomande as oggettoSegnalazione (oggettoSegnalazione.domanda.id)}
										<DomandaDash
											{oggettoSegnalazione}
											{risolviSegnalazioneDomanda}
											{cambiaDomandeSegnalate}
										/>
									{/each}
								</div>
							{/if}
						{:else if schermata == 'appunti'}
							<p class="selezionato">{schermata} da visionare</p>
							{#if listaAppunti.length == 0}
								<VuotoDash oggetti="appunti" />
							{:else}
								<div class="lista-generica">
									{#each listaAppunti as appunto (appunto.id)}
										<AppuntoDash {appunto} />
									{/each}
								</div>
							{/if}
						{/if}
					</div>
				</div>
			</div>
			<div class="gestione-corsi">
				<h1>Gestione</h1>
				<div class="pagina-azioni">
					<BoxSelezioneAzione emoji={'school'} azione="Corsi" />
					<BoxSelezioneAzione emoji={'assignment'} azione="Insegnamenti" />
					<BoxSelezioneAzione emoji={'campaign'} azione="Annunci" />
					<BoxSelezioneAzione emoji={'person_off'} azione="Sospesi" />
				</div>
			</div>

			<div class="statistiche-sito">
				<h1>Statistiche del sito</h1>
				<div class="box-statistiche">
					<ListaUtentiDash {utentiGenerali} />
					<UltimeAttivita />
				</div>
			</div>
			<CheckEverything />
		{:else}
			<Loading />
		{/if}
	{/if}
</div>

<style>
	.dashboard {
		width: 90vw;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.prima-sezione {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.prima-sinistra {
		display: flex;
		justify-content: center;
		text-align: center;
		width: 100%;
	}

	.prima-destra {
		overflow-x: scroll;
		width: 100%;
	}
	.lista-schermate {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		justify-content: center;
	}

	.attiva {
		box-shadow: var(--innerNeu);
	}
	.selezionato {
		font-size: 2rem;
		text-transform: uppercase;
		font-weight: 800;
		color: var(--testo);
		width: fit-content;
		padding: 0.2rem;
		border-radius: 4px;
	}

	.bottone {
		border: none;
		outline: none;
		padding: 1rem;
		border-radius: 0.3rem;
		cursor: pointer;
	}

	.lista-generica {
		display: flex;
		overflow-x: scroll;
		scroll-behavior: smooth;
		gap: 1rem;
		white-space: nowrap;
	}

	.gestione-corsi {
		width: 90vw;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.pagina-azioni {
		width: 90%;
		height: 80%;
		display: grid;
		place-items: center;
		grid-template-columns: 1fr 1fr;
		gap: 1em;
	}

	.box-statistiche {
		display: grid;
		grid-template-columns: 1fr 2fr;
	}
	.statistiche-sito > h1 {
		text-align: center;
	}

	@media screen and (max-width: 1000px) {
		.box-statistiche {
			grid-template-columns: 1fr;
		}
	}

	@media screen and (max-width: 850px) {
		.prima-sezione {
			grid-template-columns: 1fr;
		}
		.selezionato {
			text-align: center;
		}

		.schermata-selezionata {
			display: flex;
			flex-direction: column;
			align-items: center;
			flex-direction: column;
		}

		.lista-generica {
			flex-direction: column;
		}

		.pagina-azioni {
			grid-template-columns: 1fr;
		}
	}
</style>
