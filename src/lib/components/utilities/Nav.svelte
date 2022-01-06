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
	import { richiesteUtente } from '$lib/stores/richiesteStore';
	import ModalRichiesteCollegamento from './ModalRichiesteCollegamento.svelte';
	import BarraRicerca from './BarraRicerca.svelte';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	const logout = async () => {
		await auth.signOut().then(() => {
			location.reload();
		});
	};
	let datiUtente;

	let isOpen = false;

	onAuthStateChanged(auth, (fbUser) => {
		if (fbUser) {
			let data = {
				isLoggedIn: true,
				user: fbUser
			};

			// Se per qualche motivo tu fossi bannato
			getDoc(doc(db, 'users', fbUser.uid)).then((user) => {
				datiUtente = user;
				if (user.data().banTime) {
					// Se il tempo di ban è ancora maggiore rispetto a ora
					// Ancora non è passato abbastanza tempo dal ban (in giorni)
					if (user.data().banTime < Timestamp.now()) {
						alert('Sei ancora bannato');
						logout();
					}
				}
			});
			authStore.update((oldStore) => data);
			// Quando loggo prendo l'id degli esami e li passo allo store apposito
			let idEsami = [];
			let queryIdEsami = query(
				collection(db, 'recensioni'),
				where('idAutore', '==', auth.currentUser.uid)
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
		goto(`${auth.currentUser.uid}`);
		handleOpen();
	};
</script>

{#if !isOpen}
	<button transition:fly={{ x: -100 }} class="open-button" on:click={handleOpen}>🌎</button>
{:else}
	<nav transition:fly={{ x: -100 }}>
		<div on:click={handleOpen} class="backdrop" />
		<p class="company-name">Link 4 Students</p>
		<button class="close-button" on:click={handleOpen}>❌</button>
		<BarraRicerca />
		<a on:click={handleOpen} href="/"> <span class="icona">🏚️</span> Home</a>
		<a on:click={handleOpen} href="/corsi"> <span class="icona">🎓</span> Corsi</a>
		<a on:click={handleOpen} href="/info"> <span class="icona">📄</span> Info</a>
		<a on:click={handleOpen} href="/info"> <span class="icona">✉️</span> Contattaci</a>
		{#if datiUtente != null}
			{#if datiUtente.data().superuser}
				<a on:click={handleOpen} href="/dashboard/adminpage"> <span class="icona">🔒</span> Admin</a>
			{/if}
		{/if}
		<div class="profilo">
			{#if $authStore.isLoggedIn == true}
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

					<button class="logout" on:click={logout}>Logout</button>
				</div>
			{:else if !$authStore.isLoggedIn && $authStore.isLoggedIn != undefined}
				<a class="unisciti" href="/joinus"> <span class="icona">🙏</span> Unisciti</a>
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
		font-size: 1.5rem;
		border-radius: 100%;
		width: 50px;
		height: 50px;
		border: none;
		background-color: var(--sfondo);
		box-shadow: var(--neumorphism);
		cursor: pointer;
	}

	.close-button {
		position: absolute;
		right: -2rem;
		font-size: 1.5rem;
		border-radius: 100%;
		width: 50px;
		height: 50px;
		border: none;
		background-color: var(--sfondo);
		box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2), -5px -10px 10px rgba(219, 255, 255, 0.5);
		cursor: pointer;
	}

	nav {
		position: fixed;
		top: 0%;
		left: 0;
		width: 300px;
		height: 100vh;
		background-color: rgb(198, 209, 255);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.backdrop {
		position: absolute;
		width: 100vw;
		height: 100vh;
		left: 300px;
	}

	a {
		color: rgb(27, 27, 27);
		padding: 1rem;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
		padding: 0.5rem;
		border-radius: 0.5rem;
		text-decoration: none;
		outline: none;
		margin: 0 auto;
		width: 80%;
		
		font-size: 1.5rem;
	}

	.icona{
		font-weight: 600;

	}

	.logout {
		border: none;
		background-color: crimson;
		color: white;
		border-radius: 8px;
		padding: 6px;
		cursor: pointer;
		height: fit-content;
		align-self: center;
		width: 50%;
	}

	.profilo {
		position: absolute;
		bottom: 3rem;
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
	}

	.avatar,
	img {
		width: 75px;
		height: 75px;
		object-fit: contain;
		border-radius: 100%;
		border: solid lightblue;
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
