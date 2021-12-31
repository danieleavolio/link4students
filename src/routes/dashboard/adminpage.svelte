<script context="module">
	import { db } from '$lib/firebaseConfig';

	import { authStore } from '$lib/stores/authStore';
	import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';

	export async function load({ page }) {
		let uid = page.query.get('uid');
		let user;
		await getDoc(doc(db, 'users', uid)).then((doc) => {
			user = doc;
		});
		return {
			props: { user }
		};
	}
</script>

<script>
	import AppuntoDash from '$lib/components/dashboard/AppuntoDash.svelte';
	import DomandaDash from '$lib/components/dashboard/DomandaDash.svelte';
	import RecensioneDash from '$lib/components/dashboard/RecensioneDash.svelte';
	import UtenteDash from '$lib/components/dashboard/UtenteDash.svelte';
	import VuotoDash from '$lib/components/dashboard/VuotoDash.svelte';

	export let user;

	let sezione;
	let schermata;

	// Tutto quello che va mostrato qui
	let listaDomande = [];
	let listaUtenti = [];
	let listaRecensioni = [];
	let listaAppunti = [];

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
						tempList.push({
							segnalazione: elem,
							recensione: docum
						});
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
</script>

<svelte:head>
	<title>Admin dashboard</title>
</svelte:head>
<div class="dashboard">
	{#if $authStore.isLoggedIn}
		{#if user.data().superuser}
			<h2>Benvenuto amministratore</h2>

			<div class="scegli-sezione">
				<button on:click={() => (sezione = 'segnalazioni')} class="bottone">Segnalazioni</button>
				<button on:click={() => (sezione = 'gestione-corsi')} class="bottone">Gestione Corsi</button
				>
			</div>
			{#if sezione == 'segnalazioni'}
				<div class="prima-sezione">
					<div class="prima-sinistra">
						<div class="lista-schermate">
							<p>Lista schermate</p>
							<button on:click={clickUtenti} class="bottone">Utenti</button>
							<button on:click={clickRecensioni} class="bottone">Recensioni</button>
							<button on:click={clickDomande} class="bottone">Domande</button>
							<button on:click={clickAppunti} class="bottone">Appunti</button>
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
											<DomandaDash {oggettoSegnalazione} {risolviSegnalazioneDomanda}/>
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
			{:else if sezione == 'gestione-corsi'}
				<div class="gestione-corsi">
					<p>gestione corsi</p>
				</div>
			{/if}
		{:else}
			<p>NON SEI UN AMMINISTRATORE</p>
		{/if}
	{/if}
</div>

<style>
	.dashboard {
		width: 90vw;
		height: 100%;
	}

	.prima-sezione {
		display: grid;
		grid-template-columns: 1fr 2fr;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.prima-sinistra {
		display: flex;
		justify-content: center;
		text-align: center;
	}
	.lista-schermate {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 50%;
		justify-content: center;
	}

	.selezionato {
		background-color: blue;
		font-size: 2rem;
		text-transform: uppercase;
		font-weight: 800;
		color: white;
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
		width: 70vw;
		gap: 1rem;
		white-space: nowrap;
	}

	.scegli-sezione {
		display: flex;
		justify-content: space-around;
		gap: 1rem;
	}
</style>
