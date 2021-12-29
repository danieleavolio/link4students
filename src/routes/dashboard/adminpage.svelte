<script context="module">
	import { db } from '$lib/firebaseConfig';

	import { authStore } from '$lib/stores/authStore';
	import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore';

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
	import RecensioneDash from '$lib/components/dashboard/RecensioneDash.svelte';

	export let user;

	let schermata = 'utenti';
	// Tutto quello che va mostrato qui
	let idDomandeSegnalate = [];
	let listaDomande = [];
	let idUtentiSegnalati = [];
	let listaUtenti = [];
	let idRecensioniSegnalate = [];
	let listaRecensioni = [];
	let idAppuntiDaVisionare = [];
	let listaAppunti = [];

	const clickDomande = () => {
		schermata = 'domande';
		if (idDomandeSegnalate.length == 0) {
			const queryDomande = query(collection(db, 'domande'));
			const realTimeDomande = onSnapshot(queryDomande, (querySnapshot) => {
				idDomandeSegnalate = querySnapshot.docs;
			});
		}
	};

	const clickUtenti = () => {
		schermata = 'utenti';
		if (idUtentiSegnalati.length == 0) {
			const queryUtenti = query(collection(db, 'users'));
			const realTimeUtenti = onSnapshot(queryUtenti, (querySnapshot) => {
				idUtentiSegnalati = querySnapshot.docs;
			});
		}
	};

	const clickRecensioni = () => {
		schermata = 'recensioni';

		if (listaRecensioni.length == 0) {
			const queryRecensioni = query(collection(db, 'segnalazioniRecensioni'));
			const realTimeRecensioni = onSnapshot(queryRecensioni, (querySnapshot) => {
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

	const cambiaListaLocale = (idSegnalazione) =>{
		// Quando elimino una recensione, tolgo dalla lista locale tutte le segnalazioni di quella recensione
		listaRecensioni = listaRecensioni.filter(elem => elem.segnalazione.id == idSegnalazione)
	}

	const clickAppunti = () => {
		schermata = 'appunti';

		if (idAppuntiDaVisionare.length == 0) {
			const queryAppunti = query(collection(db, 'appunti'));
			const realTimeAppunti = onSnapshot(queryAppunti, (querySnapshot) => {
				idAppuntiDaVisionare = querySnapshot.docs;
			});
		}
	};
</script>

<div class="dashboard">
	{#if $authStore.isLoggedIn}
		{#if user.data().superuser}
			<div class="prima-sezione">
				<div class="prima-sinistra">
					<div class="lista-schermate">
						<h2>Benvenuto amministratore</h2>
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
							<div class="lista-generica">
								{#each idUtentiSegnalati as utente (utente.id)}
									<p>{utente.data().nome}</p>
								{/each}
							</div>
						{:else if schermata == 'recensioni'}
							<p class="selezionato">Segnalazioni {schermata}</p>
							<div class="lista-generica">
								{#each listaRecensioni as oggettoSegnalazione (oggettoSegnalazione.segnalazione.id)}
									<RecensioneDash {oggettoSegnalazione} {cambiaListaLocale} />{/each}
							</div>
						{:else if schermata == 'appunti'}
							<p class="selezionato">{schermata} da visionare</p>
							<div class="lista-generica">
								{#each idAppuntiDaVisionare as appunto (appunto.id)}
									<p>Appunto {appunto.data()}</p>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
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
</style>
