<script lang="ts">
	import { authStore } from '$lib/stores/authStore';
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth, db } from '$lib/firebaseConfig';
	import {
		collection,
		doc,
		getDoc,
		getDocs,
		onSnapshot,
		query,
		Timestamp,
		where
	} from 'firebase/firestore';
	import { esamiReagiti, esamiRecensiti } from '$lib/stores/recensioniStore';
	import { utentiSegnalati } from '$lib/stores/utentiStores';
	import { esamiLibretto } from '$lib/stores/esamiLibretto';
	import { richiesteMandate, richiesteUtente } from '$lib/stores/richiesteStore';
	import ModalRichiesteCollegamento from './ModalRichiesteCollegamento.svelte';
	import BarraRicerca from './BarraRicerca.svelte';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { collegamentiUtente } from '$lib/stores/collegamentiStore';
	const logout = async () => {
		await auth.signOut().then(() => {
			goto('/');
		});
	};
	let datiUtente;

	let isOpen = false;

	onAuthStateChanged(auth, async (fbUser) => {
		if (fbUser) {
			let data = {
				isLoggedIn: true,
				user: fbUser
			};

			// Se per qualche motivo tu fossi bannato
			await getDoc(doc(db, 'users', fbUser.uid)).then(async (user) => {
				datiUtente = user;
				await getDoc(doc(db, 'banTimes', fbUser.uid)).then((ban) => {
					if (ban.exists()) {
						if (ban.data().time < Timestamp.now()) {
							alert('Still banned');
							logout();
						}
					}
				});
			});
			// Passo le info allo store dopo che carico le info utente
			// Altrimenti non potrebbe aspettare l'AWAIT del getDoc delle info
			// E se si aprisse la Nav appena renderizzata, non ci sarebbero le info utili per andare al profilo
			authStore.update((oldStore) => data);

			// Quando loggo prendo l'id degli esami e li passo allo store apposito
			let idEsami = [];
			let queryIdEsami = query(
				collection(db, 'recensioni'),
				where('autore.idAutore', '==', auth.currentUser.uid)
			);
			getDocs(queryIdEsami).then((res) => {
				res.docs.forEach((doc) => {
					idEsami = [...idEsami, doc.data().idCorso];
				});
				esamiRecensiti.update((old) => idEsami);
			});
			// aggiorno lo store per i likes alle recensioni
			let reazioniRecensioni = [];
			// Prendo le recensioni con il mio id utente
			let queryReazioni = query(
				collection(db, 'votiRecensioni'),
				where('idUtente', '==', auth.currentUser.uid)
			);
			getDocs(queryReazioni).then((res) => {
				res.docs.forEach((doc) => {
					reazioniRecensioni = [...reazioniRecensioni, doc];
				});
				// Aggiorno lo store delle reazioni
				esamiReagiti.update((oldReaction) => reazioniRecensioni);
			});

			// Appunti reagiti

			// Lista degli utenti segnalati per la UI
			const querySegnalazioni = query(
				collection(db, 'segnalazioniUtenti'),
				where('idSegnalatore', '==', auth.currentUser.uid)
			);
			getDocs(querySegnalazioni).then((res) => {
				let listaUtenti = [];
				res.docs.forEach((elem) => {
					listaUtenti = [...listaUtenti, elem.data()];
				});
				utentiSegnalati.update((oldReports) => listaUtenti);
			});

			// Lista degli esami del libretto
			let libretto = [];
			const queryLibretto = query(
				collection(db, 'esamiLibretto'),
				where('uidUtente', '==', fbUser.uid)
			);
			onSnapshot(queryLibretto, (snapshot) => {
				// Se non svuoto ho duplicati
				// Problema con rendering in keyed each block
				// Render di 2 cose con lo stesso id --> promise catch error
				libretto = [];
				snapshot.docs.forEach((esame) => {
					libretto = [...libretto, esame];
				});
				esamiLibretto.update((oldEsami) => libretto);
			});

			// Gestione richieste di collegamento
			const queryRichieste = query(
				collection(db, 'richiesteCollegamento'),
				where('uidDestinatario', '==', fbUser.uid)
			);
			let richiesteList = [];
			onSnapshot(queryRichieste, (richiesteSnap) => {
				richiesteList = richiesteSnap.docs;
				richiesteUtente.update((oldRichieste) => richiesteList);
			});

			// Gestione richieste mandate
			let mandateList = [];
			const queryRicMandate = query(
				collection(db, 'richiesteCollegamento'),
				where('uidMittente', '==', fbUser.uid)
			);
			onSnapshot(queryRicMandate, (mandateSnap) => {
				mandateList = mandateSnap.docs;
				richiesteMandate.update((oldRichieste) => mandateList);
				
			});

			//Collegamenti utente che sono in tempo reale
			const queryCollegamentiUtente = query(
				collection(db, 'collegamenti'),
				where('idUtente', '==', fbUser.uid)
			);
			let collegamentiList = [];
			onSnapshot(queryCollegamentiUtente, (snapshot) => {
				collegamentiList = snapshot.docs;
				collegamentiUtente.update((oldCollegamenti) => collegamentiList);
			});
		} else {
			let data = {
				isLoggedIn: false,
				user: null
			};
			authStore.update((oldStore) => data);
		}
	});

	const handleOpen = () => {
		isOpen = !isOpen;
	};

	const gotoProfilo = () => {
		goto(`/profilo/${auth.currentUser.uid}`);
		handleOpen();
	};
</script>

{#if !isOpen}
	<button transition:fly={{ x: -100 }} class="open-button" on:click={handleOpen}
		><span class="material-icons hamburger"> menu </span>
	</button>
{:else}
	<nav transition:fly={{ x: -100 }}>
		<div on:click={handleOpen} class="backdrop" />
		<p class="company-name">Link 4 Students</p>
		<button class="close-button" on:click={handleOpen}><span class="material-icons">
			close
			</span></button>
		<BarraRicerca />
		<a on:click={handleOpen} href="/"> <span class="material-icons"> home </span> Home</a>
		<a on:click={handleOpen} href="/corsi"> <span class="material-icons"> school </span> Corsi</a>
		<a on:click={handleOpen} href="/info"> <span class="material-icons"> info </span> Info</a>
		<a on:click={handleOpen} href="/contattaci">
			<span class="material-icons"> email </span> Contattaci</a
		>
		{#if datiUtente != null}
			{#if datiUtente.data().superuser}
				<a on:click={handleOpen} href="/dashboard/adminpage">
					<span class="material-icons"> gpp_maybe </span> Admin</a
				>
			{/if}
		{/if}
		<div class="profilo">
			{#if $authStore.isLoggedIn}
				<div class="info" on:click={gotoProfilo}>
					<div class="avatar">
						<img src={datiUtente.data().avatar} alt="" />
					</div>
					<a class="nome-profilo" href="/profilo/{auth.currentUser.uid}"
						>{datiUtente.data().nome} {datiUtente.data().cognome}</a
					>
				</div>
				<div class="others">
					<ModalRichiesteCollegamento />

					<button class="logout" on:click={logout}
						>Logout <span class="material-icons"> logout </span></button
					>
				</div>
			{:else if !$authStore.isLoggedIn}
				<a on:click={handleOpen} class="unisciti" href="/reg/joinus">
					<span class="material-icons"> input </span> Unisciti</a
				>
			{/if}
		</div>
	</nav>
{/if}

<style>
	.company-name {
		font-size: 2rem;
		font-weight: 600;
		text-align: center;
		box-shadow: var(--neumorphism);
		border-radius: 0.5rem;
		margin: 2rem 0.5rem;
	}
	.open-button {
		position: fixed;
		top: 10px;
		left: 10px;
		font-size: 2rem;
		border-radius: 100%;
		background-color: var(--sfondo);
		box-shadow: var(--neumorphism);
		cursor: pointer;
		transition: var(--velocita);
		font-weight: 600;
		aspect-ratio: 1/1;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.2em;
	}

	.hamburger {
		font-size: 1.2em;
	}

	.open-button:hover {
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}

	.close-button {
		position: absolute;
		right: -2em;
		font-size: 2em;
		border-radius: 100%;
		width: 75px;
		height: 75px;
		border: none;
		background-color: var(--sfondo);
		box-shadow: var(--neumorphism);
		cursor: pointer;
		transition: all 0.5s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-button:hover {
		box-shadow: var(--innerNeu);
	}

	nav {
		position: fixed;
		top: 0%;
		left: 0;
		width: 300px;
		height: 100vh;
		background-color: var(--sfondo);
		box-shadow: var(--neumorphism);
		border-radius: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		z-index: 10;
	}
	.backdrop {
		position: absolute;
		width: 100vw;
		height: 100vh;
		left: 300px;
	}

	a {
		color: var(--testo);
		padding: 1rem;
		box-shadow: var(--neumorphism);
		padding: 0.5rem;
		border-radius: 0.5rem;
		text-decoration: none;
		outline: none;
		margin: 0 auto;
		width: 80%;
		transition: all 0.2s ease;
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1em;
	}

	a:hover {
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}

	span {
		color: var(--testo);
	}

	.logout {
		border: none;
		background-color: var(--sfondo);
		color: var(--alert);
		border-radius: 8px;
		padding: 6px;
		cursor: pointer;
		height: fit-content;
		align-self: center;
		width: 50%;
		box-shadow: var(--neumorphism);
		transition: all 0.2s ease;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1em;
	}

	.logout > span{
		color: var(--alert);
		font-weight: 600;
	}
	.logout:hover {
		box-shadow: var(--alertHover);
		transform: var(--premuto);
		color: var(--sfondo);
		background-color: var(--alert);
	}
	.logout:hover > span {

		box-shadow: var(--alertHover);
		transform: var(--premuto);
		color: var(--sfondo);
		background-color: var(--alert);
	}

	.profilo {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		width: 90%;
		margin: 0 1rem;
	}

	.info {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: space-around;
		box-shadow: var(--neumorphism);
		padding: 0.2rem;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: var(--velocita);
	}

	.info:hover {
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}

	.info > a {
		box-shadow: none;
	}

	.avatar,
	img {
		width: 75px;
		height: 75px;
		object-fit: cover;
		border-radius: 100%;
		border: var(--bordo);
	}

	.nome-profilo {
		text-align: center;
		align-self: center;
	}

	.unisciti {
		text-align: center;
	}

	.others {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin: 1rem 0;
	}
</style>
