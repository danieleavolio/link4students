<script context="module">
	import { db, storage } from '$lib/firebaseConfig';
	import {
		collection,
		doc,
		getDoc,
		getDocs,
		onSnapshot,
		query,
		setDoc,
		where
	} from 'firebase/firestore';
	export async function load({ page }) {
		// Prendere da Firebase le informazioni dell'utente come singolo documento
		// per utilizzarlo all'interno della pagina per scegliere cosa mostrare.

		const uid = page.params.uid;
		const collectionRef = collection(db, 'users');
		const queryToDo = query(collectionRef, where('uid', '==', uid));
		let profilo;
		let esamiCdl = [];
		let esamiSuperati = [];
		let collegamentiUtente = [];
		let appuntiCaricati = [];
		let collegati = false;
		let isDatiAccessibili = false;

		await getDocs(queryToDo).then(async (document) => {
			let docs = document.docs;
			profilo = docs[0].data();

			// Se sto visitando il mio stesso profilo
			if (getAuth().currentUser != null) {
				if (getAuth().currentUser.uid == uid) {
					collegati = true;
					isDatiAccessibili = true;
					// SET PREFERENZA SE NON SETTATA
					profilo.preferenzaLibretto =
						profilo.preferenzaLibretto != undefined ? profilo.preferenzaLibretto : 'tutti';
					let queryEsamiCDL = query(
						collection(db, 'corsidelcdl'),
						where('cdl', '==', profilo.corsoDiLaurea)
					);
					// await altrimenti ritorna fuori dalla funzione prima della fine
					await getDocs(queryEsamiCDL).then((esami) => {
						esamiCdl = esami.docs;
					});
					const queryEsamiSuperati = query(
						collection(db, 'esamiLibretto'),
						where('uidUtente', '==', uid)
					);
					await getDocs(queryEsamiSuperati).then((esami2) => {
						esamiSuperati = esami2.docs;
					});

					// Prendo i collegamenti dell'utente
					const queryCollegamenti = query(
						collection(db, 'collegamenti'),
						where('idUtente', '==', uid)
					);
					await getDocs(queryCollegamenti).then((collegamenti) => {
						collegamentiUtente = collegamenti.docs;
					});
				} else if (profilo.preferenzaLibretto != 'nessuno') {
					if (profilo.preferenzaLibretto == 'connessi') {
						// Se ha la preferenza su 'tutti' oppure siamo collegati
						await getDoc(doc(db, 'collegamenti', getAuth().currentUser.uid + uid)).then(
							async (res) => {
								if (res.exists()) {
									collegati = true;
									isDatiAccessibili = true;
									let queryEsamiCDL = query(
										collection(db, 'corsidelcdl'),
										where('cdl', '==', profilo.corsoDiLaurea)
									);

									const queryEsamiSuperati = query(
										collection(db, 'esamiLibretto'),
										where('uidUtente', '==', uid)
									);
									// Prendo i collegamenti dell'utente
									const queryCollegamenti = query(
										collection(db, 'collegamenti'),
										where('idUtente', '==', uid)
									);

									// await altrimenti ritorna fuori dalla funzione prima della fine
									await getDocs(queryEsamiCDL).then(async (esami) => {
										esamiCdl = esami.docs;
										await getDocs(queryEsamiSuperati).then(async (esami2) => {
											esamiSuperati = esami2.docs;
											await getDocs(queryCollegamenti).then((collegamenti) => {
												collegamentiUtente = collegamenti.docs;
											});
										});
									});
								} else {
									collegati = false;
								}
							}
						);
					} else {
						isDatiAccessibili = true;
						let queryEsamiCDL = query(
							collection(db, 'corsidelcdl'),
							where('cdl', '==', profilo.corsoDiLaurea)
						);

						const queryEsamiSuperati = query(
							collection(db, 'esamiLibretto'),
							where('uidUtente', '==', uid)
						);
						// Prendo i collegamenti dell'utente
						const queryCollegamenti = query(
							collection(db, 'collegamenti'),
							where('idUtente', '==', uid)
						);

						// await altrimenti ritorna fuori dalla funzione prima della fine
						await getDocs(queryEsamiCDL).then(async (esami) => {
							esamiCdl = esami.docs;
							await getDocs(queryEsamiSuperati).then(async (esami2) => {
								esamiSuperati = esami2.docs;
								await getDocs(queryCollegamenti).then((collegamenti) => {
									collegamentiUtente = collegamenti.docs;
								});
							});
						});
					}
				} else if (
					profilo.preferenzaLibretto == 'nessuno' ||
					profilo.preferenzaLibretto == undefined
				) {
					await getDoc(doc(db, 'collegamenti', getAuth().currentUser.uid + uid)).then((res) => {
						if (res.exists()) {
							isDatiAccessibili = false;
							collegati = true;
						}
					});
				}
			} else {
				if (profilo.preferenzaLibretto == 'tutti') {
					isDatiAccessibili = true;
					// SET PREFERENZA SE NON SETTATA
					profilo.preferenzaLibretto =
						profilo.preferenzaLibretto != undefined ? profilo.preferenzaLibretto : 'tutti';
					let queryEsamiCDL = query(
						collection(db, 'corsidelcdl'),
						where('cdl', '==', profilo.corsoDiLaurea)
					);
					// await altrimenti ritorna fuori dalla funzione prima della fine
					await getDocs(queryEsamiCDL).then((esami) => {
						esamiCdl = esami.docs;
					});
					const queryEsamiSuperati = query(
						collection(db, 'esamiLibretto'),
						where('uidUtente', '==', uid)
					);
					await getDocs(queryEsamiSuperati).then((esami2) => {
						esamiSuperati = esami2.docs;
					});

					// Prendo i collegamenti dell'utente
					const queryCollegamenti = query(
						collection(db, 'collegamenti'),
						where('idUtente', '==', uid)
					);
					await getDocs(queryCollegamenti).then((collegamenti) => {
						collegamentiUtente = collegamenti.docs;
					});
				}
			}
		});

		let queryAppunti = query(collection(db, 'appunti'), where('idUtente', '==', uid));
		await getDocs(queryAppunti).then((lista) => {
			appuntiCaricati = lista.docs;
		});

		// Controlli fatti quando faccio il load della pagina per avere tutto pronto
		let preferenza = profilo.preferenzaLibretto == undefined ? 'tutti' : profilo.preferenzaLibretto;
		let contenutoBio = profilo.bio != undefined ? profilo.bio : 'Bio vuota..';
		let sommaVoti = 0;
		let mediaUtente = 0;
		if (esamiSuperati.length > 0) {
			sommaVoti = 0;
			esamiSuperati.forEach((elem) => (sommaVoti += elem.data().voto));
			mediaUtente = Math.round((sommaVoti / esamiSuperati.length) * 100) / 100;
		}
		// Calcolo dati utente

		return {
			props: {
				profilo,
				esamiCdl,
				esamiSuperati,
				collegamentiProfilo: collegamentiUtente,
				preferenza,
				contenutoBio,
				sommaVoti,
				mediaUtente,
				collegati,
				appunti: appuntiCaricati,
				isDatiAccessibili
			}
		};
	}
</script>

<script lang="ts">
	export let profilo;
	export let esamiCdl;
	export let esamiSuperati;
	export let collegamentiProfilo;
	export let contenutoBio;
	export let sommaVoti;
	export let mediaUtente;
	export let appunti;
	export let isDatiAccessibili;

	import SegnalazioneUtente from '$lib/components/utilities/SegnalazioneUtente.svelte';
	import { authStore } from '$lib/stores/authStore';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
	import { fade } from 'svelte/transition';
	import { utentiSegnalati } from '$lib/stores/utentiStores';
	import ModalAggLibretto from '$lib/components/profilo/ModalAggLibretto.svelte';
	import { afterUpdate, onMount } from 'svelte';
	import Libretto from '$lib/components/profilo/Libretto.svelte';
	import LibrettoNascosto from '$lib/components/profilo/LibrettoNascosto.svelte';
	import { fly } from 'svelte/transition';
	import Appunto from '$lib/components/utilities/Appunto.svelte';
	import { getAuth } from 'firebase/auth';
	import { richiesteMandate, richiesteUtente } from '$lib/stores/richiesteStore';
	import { collegamentiUtente } from '$lib/stores/collegamentiStore';
	import { goto } from '$app/navigation';

	let profilePicture;
	let file;
	const onChange = () => {
		// Quando scelgo l'immagine viene assegnato a questo file
		file = profilePicture.files[0];
	};

	// CHECK PREFERENZA PROFILO SE NON SETTATA
	let loading = true;

	const cambiaFoto = () => {
		if (file) {
			let picturesRef = ref(storage, `profilePictures/avatar${profilo.uid}`);
			// Carico l'immagine del profilo nel database
			uploadBytes(picturesRef, file).then(() => {
				// Prendo l'url dell'immagine appena caricata
				getDownloadURL(picturesRef).then((url) => {
					// Aggiorno l'immagine del profilo dell'utente con il link di quello caricato
					setDoc(
						doc(db, 'users', $authStore.user.uid),
						{
							avatar: url
						},
						{ merge: true }
					).then(() => {
						// Ricarica la pagina per le modifiche
						location.reload();
					});
				});
			});
		} else {
			alert('Errore caricamento immagine');
		}
	};

	export let collegati;
	$: if (esamiSuperati.length > 0) {
		sommaVoti = 0;
		esamiSuperati.forEach((elem) => (sommaVoti += elem.data().voto));
		mediaUtente = Math.round((sommaVoti / esamiSuperati.length) * 100) / 100;
	}

	afterUpdate(() => {
		if ($authStore.isLoggedIn) {
			if (collegamentiProfilo.find((elem) => elem.data().idCollegato == $authStore.user.uid)) {
				collegati = true;
			}
		}
	});

	// Controllo per vedere se siamo collegati quando cambia la lista dei collegamenti
	$: if (
		$authStore.isLoggedIn &&
		$collegamentiUtente.find((elem) => elem.data().idCollegato == profilo.uid)
	) {
		collegati = true;
	}

	onMount(() => {
		// Controllo per capire se devo mostrare o meno le informazioni
		if (isDatiAccessibili) {
			if ($authStore.isLoggedIn) {
				if (collegamentiProfilo.find((elem) => elem.data().idCollegato == $authStore.user.uid)) {
					collegati = true;
				}
			}
			// realtime updates
			const queryEsamiSuperati = query(
				collection(db, 'esamiLibretto'),
				where('uidUtente', '==', profilo.uid)
			);
			// Realtime-esami
			onSnapshot(queryEsamiSuperati, (snapshot) => {
				esamiSuperati = snapshot.docs;
			});

			// Realtime collegamenti
			const queryCollegamenti = query(
				collection(db, 'collegamenti'),
				where('idUtente', '==', profilo.uid)
			);
			onSnapshot(queryCollegamenti, (collegamenti) => {
				collegamentiProfilo = collegamenti.docs;
			});
		}
		loading = false;
	});

	// Controllare se i due sono collegati
	// Quando refreshi --> sei sloggato per controllo da firebase
	// Quando torni riloggato --> si esegue la funzione
	$: if ($authStore.isLoggedIn) {
		if (collegamentiProfilo.find((elem) => elem.data().idCollegato == $authStore.user.uid)) {
			collegati = true;
		}
	}

	const mandaRichiestaCollegamento = () => {
		if ($authStore.isLoggedIn) {
			// GESTIRE SE GIA' PRESENTE

			// Prendo le info del mittente
			getDoc(doc(db, 'users', $authStore.user.uid)).then((user) => {
				// Manda richiesta all'id della pagina
				setDoc(doc(db, 'richiesteCollegamento', $authStore.user.uid + profilo.uid), {
					uidMittente: $authStore.user.uid,
					uidDestinatario: profilo.uid,
					nomeCognomeMittente: user.data().nome + ' ' + user.data().cognome,
					avatarMittente: user.data().avatar
				});
			});
		}
	};

	// Se gli appunti vengono eliminati aggiorno la UI tramite questo
	let queryAppunti = query(collection(db, 'appunti'), where('idUtente', '==', profilo.uid));
	onSnapshot(queryAppunti, (lista) => {
		appunti = lista.docs;
	});
</script>

<svelte:head>
	<title>Profilo</title>
</svelte:head>
<h1>Profilo</h1>
<div class="container-profilo">
	<div class="avatar">
		<div class="image-div">
			<img src={profilo.avatar} alt="" />
		</div>
		<!-- {#if $authStore.isLoggedIn}
			{#if profilo.uid == $authStore.user.uid && modificaPreferenze}
				<div class="cambia-immagine">
					<form on:submit|preventDefault={cambiaFoto} action="">
						<label class="bottone-file" for="file">Cambia immagine del profilo</label>
						<input
							class="da-nascondere"
							type="file"
							bind:this={profilePicture}
							on:change={onChange}
							accept="images/pmg, images/jpg "
							id="file"
						/>
						{#if file}
							<button transition:fade class="conferma">Conferma</button>
						{/if}
					</form>
				</div>
			{/if}
		{/if} -->
	</div>
	<div class="info">
		<p class="nomecognome">{profilo.nome} {profilo.cognome}</p>
		<p>Matricola: {profilo.matricola}</p>
		<p>Corso di Laurea: {profilo.nomeCorsoLaurea}</p>
		<p>Anno di corso: {profilo.annoDiCorso}</p>
		{#if $authStore.isLoggedIn}
			<!-- DEBUG -->

			{#if $authStore.user.uid != profilo.uid}
				<div class="connect-report-buttons">
					{#if !collegati}
						<!-- Se non gli ho mandato una richiesta e lui non l'ha mandata a me -->
						{#if !$richiesteMandate.find((elem) => elem.data().uidDestinatario == profilo.uid) && !$richiesteUtente.find((elem) => elem.data().uidMittente == profilo.uid)}
							<button on:click={mandaRichiestaCollegamento} class="bottone collegati"
								>Collegati</button
							>
						{:else if $richiesteUtente.find((elem) => elem.data().uidMittente == profilo.uid) && !$richiesteMandate.find((elem) => elem.data().uidDestinatario == profilo.uid)}
							<button class="bottone controlla-collegamento">Controlla richieste</button>
						{:else}
							<button class="bottone mandato">Richiesta Mandata</button>
						{/if}
					{/if}
					<div class="report">
						{#if $utentiSegnalati.find((elem) => elem.idSegnalato == profilo.uid)}
							<SegnalazioneUtente idUtente={profilo.uid} segnalato={true} />
						{:else}
							<SegnalazioneUtente idUtente={profilo.uid} segnalato={false} />
						{/if}
					</div>
				</div>
			{:else}
				<button class="modifica-preferenza" on:click={() => goto('/profilo/modificainfo')}
					>Modifica preferenze</button
				>
			{/if}
		{/if}
	</div>
	<div class="bio">
		<p class="titolo-bio">Bio</p>
		<div class="container-bio">
			{#if profilo.bio}
				<p class="bio">{profilo.bio}</p>
			{:else}
				<p class="bio bio-vuota">{contenutoBio}</p>
			{/if}
		</div>
	</div>
</div>
<div class="sezione-titolo-libretto">
	<p class="titolo-libretto">Libretto</p>
	{#if $authStore.isLoggedIn}
		{#if $authStore.user.uid == profilo.uid}
			<ModalAggLibretto {profilo} bind:librettoEsami={esamiSuperati} />
		{/if}
	{/if}
</div>
{#if !loading}
	<div transition:fly class="container-libretto">
		<!-- Separo le due viste -->
		{#if $authStore.isLoggedIn}
			{#if $authStore.user.uid == profilo.uid}
				<Libretto
					{mediaUtente}
					{esamiSuperati}
					{esamiCdl}
					collegamentiUtente={collegamentiProfilo}
				/>
			{:else if profilo.preferenzaLibretto == 'tutti'}
				<Libretto
					{mediaUtente}
					{esamiSuperati}
					{esamiCdl}
					collegamentiUtente={collegamentiProfilo}
				/>
			{:else if profilo.preferenzaLibretto == 'connessi'}
				{#if collegati}
					<Libretto
						{mediaUtente}
						{esamiSuperati}
						{esamiCdl}
						collegamentiUtente={collegamentiProfilo}
					/>
				{:else}
					<LibrettoNascosto />
				{/if}
			{:else if profilo.preferenzaLibretto == 'nessuno'}
				<LibrettoNascosto />
			{/if}
			<!-- SE NON SEI LOGGATO -->
		{:else if profilo.preferenzaLibretto == 'tutti'}
			<Libretto {mediaUtente} {esamiSuperati} {esamiCdl} collegamentiUtente={collegamentiProfilo} />
		{:else if profilo.preferenzaLibretto == 'connessi'}
			<LibrettoNascosto />
		{:else if profilo.preferenzaLibretto == 'nessuno'}
			<LibrettoNascosto />
		{/if}
	</div>
{:else}
	<div class="loading" />
{/if}

<p class="titolo-appunti">Appunti di {profilo.nome}</p>
<div class="appunti">
	<div class="lista-appunti">
		{#if appunti.length > 0}
			{#each appunti as appunto}
				<Appunto {appunto} />
			{/each}
		{:else}
			<p class="nessuno">Nessun appunto caricato</p>
		{/if}
	</div>
</div>

<style>
	button {
		font-size: 1rem;
		border-radius: 0.4rem;
		padding: 0.3rem;
		cursor: pointer;
		box-shadow: var(--neumorphism);
		transition: var(--velocita);
		border: var(--bordo);
		color: var(--testo);
	}

	button:hover {
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}
	.sezione-titolo-libretto {
		text-align: center;
		font-size: 1.5rem;
	}

	.container-libretto {
		width: 80%;
		padding: 1rem;
		border-radius: 0.5rem;
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 1rem;
	}

	.container-profilo {
		display: flex;
		flex-wrap: wrap;
		width: 80%;
		box-shadow: var(--innerNeu);
		border-radius: 20px;
		padding: 1rem;
		justify-content: space-around;
		align-items: center;
	}

	.image-div {
		width: 200px;
		height: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: var(--neumorphism);
		border: var(--bordo);
		border-radius: 100%;
	}

	.image-div > img {
		width: 100%;
		height: 100%;
		border-radius: 100%;
		object-fit: cover;
	}
	.avatar {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.bio {
		padding: 1em;
	}
	.titolo-bio {
		margin: 0;
		padding: 0;
	}

	.nomecognome {
		font-size: 1.5rem;
	}

	.bio {
		display: flex;
		flex-direction: column;
		align-items: left;
		justify-content: space-around;
		width: 400px;
		overflow-wrap: break-word;
		gap: 0.5em;
	}

	.bio > p {
		text-align: center;
	}

	.container-bio {
		width: 80%;
		height: 100px;
		font-style: italic;
		box-shadow: var(--neumorphism);
		border-radius: 10px;
		align-self: center;
		margin: 0.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow-wrap: anywhere;
		word-break: break-all;
	}

	.modifica-preferenza {
		padding: 0.5rem;
		font-size: 1rem;
		border-radius: 0.3rem;
		cursor: pointer;
	}

	.connect-report-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	}

	.bottone {
		width: fit-content;
		padding: 0.3rem 1rem;
		border-radius: 0.3rem;
		color: var(--testo);
		cursor: pointer;
	}

	.report {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading {
		border: var(--testo) 10px solid;
		border-top: var(--sfondo) 10px solid;
		border-radius: 50%;
		width: 100px;
		height: 100px;
		animation: loading 1s linear infinite;
		margin: auto;
	}

	@keyframes loading {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.collegati {
		color: var(--collegati);
	}

	.titolo-appunti {
		font-size: 1.5rem;
		text-align: center;
	}

	.appunti {
		margin: 2rem;
		box-shadow: var(--innerNeu);
		padding: 2rem;
		border-radius: 1rem;
		width: 80vw;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.nessuno {
		font-size: 1.5rem;
	}

	.mandato {
		color: var(--submit);
		cursor: inherit;
	}
	.mandato:hover {
		transform: scale(1);
		box-shadow: var(--neumorphism);
	}

	.controlla-collegamento {
		cursor: inherit;
		color: var(--sfondo);
		background-color: rgb(255, 255, 137);
	}

	.controlla-collegamento:hover {
		box-shadow: var(--neumorphism);
		transform: scale(1);
	}

	.lista-appunti {
		display: grid;
		grid-template-columns: auto auto;
		gap: 3em;
		place-items: center;
	}
</style>
