<script lang="ts">
	import { authStore } from '$lib/stores/authStore';
	import { fly } from 'svelte/transition';
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
	const logout = async () => {
		await auth.signOut().then(() => {
			location.reload();
		});
	};

	onAuthStateChanged(auth, (fbUser) => {
		if (fbUser) {
			let data = {
				isLoggedIn: true,
				user: fbUser
			};

			// Se per qualche motivo tu fossi bannato
			getDoc(doc(db, 'users', fbUser.uid)).then((user) => {
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
				snapshot.docs.forEach((esame) => {
					libretto = [...libretto, esame];
				});
				esamiLibretto.update((oldEsami) => libretto);
			});
		} else {
			let data = {
				isLoggedIn: false,
				user: null
			};
			authStore.update((oldStore) => data);
		}
	});
</script>

<nav>
	<a href="/">Link4Students</a>
	<a href="/corsi">Corsi</a>
	<a href="/info">Info</a>
	<div class="div">
		{#if $authStore.isLoggedIn == true}
			<a transition:fly={{ y: 200, duration: 1000 }} href="/profilo/{auth.currentUser.uid}"
				>Profilo</a
			>
			<a href="/dashboard/adminpage?uid={$authStore.user.uid}">Admin</a>
			<button class="logout" on:click={logout}>Logout</button>
		{:else if !$authStore.isLoggedIn && $authStore.isLoggedIn != undefined}
			<a transition:fly={{ y: -200, duration: 500 }} href="/joinus">Unisciti</a>
		{/if}
	</div>
</nav>

<style>
	nav {
		width: 100%;
		height: 50px;
		background-color: purple;
		display: flex;
		flex-wrap: wrap;
		gap: 1em;
		align-items: center;
		justify-content: center;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 100;
	}

	a {
		color: white;
		text-decoration: none;
		outline: none;
	}

	.logout {
		font-size: 1.1rem;
		border: none;
		background-color: crimson;
		color: white;
		border-radius: 8px;
		padding: 6px;
		cursor: pointer;
	}
</style>
