<script lang="ts">
	import { goto } from '$app/navigation';
	import { db } from '$lib/firebaseConfig';
	import {
		collection,
		deleteDoc,
		doc,
		getDocs,
		query,
		setDoc,
		Timestamp,
		where
	} from 'firebase/firestore';
	import { fade, fly } from 'svelte/transition';
	import SegnalazioneDomanda from './SegnalazioneDomanda.svelte';

	export let oggettoSegnalazione;
	export let risolviSegnalazioneDomanda;
	export let cambiaDomandeSegnalate;

	let segnalazioneMostrata = false;

	// Per ordinare in real time
	//  da qualche problema

	const displayReport = () => {
		segnalazioneMostrata = !segnalazioneMostrata;
	};
	const redirectProfilo = (id) => {
		goto(`/profilo/${id}`);
	};

	const eliminaDomanda = () => {
		// Prendo tutte le risposte alla domanda e le elimino
		const queryRisposteDaEl = query(
			collection(db, 'risposte'),
			where('idDomanda', '==', oggettoSegnalazione.domanda.id)
		);
		// Elimino tutte le risposte di quella domanda
		getDocs(queryRisposteDaEl)
			.then((docs) => {
				docs.docs.forEach((element) => {
					deleteDoc(element.ref);
				});
			})
			.then(() => {
				// Elimino tutte le segnalazioni a quella domanda
				const querySegnalazioni = query(
					collection(db, 'segnalazioniDomande'),
					where('idDomanda', '==', oggettoSegnalazione.domanda.id)
				);
				getDocs(querySegnalazioni)
					.then((segnalazioni) => {
						segnalazioni.forEach((segnalazione) => {
							deleteDoc(segnalazione.ref);
						});
					})
					.then(() => {
						// cambio le domande segnalate localmente
						cambiaDomandeSegnalate(oggettoSegnalazione.domanda.id);
						// Elimino la domanda stessa
						deleteDoc(doc(db, 'domande', oggettoSegnalazione.domanda.id))
							.then(() => {
								alert('Domanda eliminata');
							})
							.catch((error) => {
								alert(error.message);
							});
					});
			})
			.catch((error) => {
				alert(error.message);
			});
	};

	let giorniSospensione;

	const setBanTime = (uid) => {
		// 86400 è il numero di secondi in un giorni
		let giorniInSecondi = giorniSospensione * 86400;
		let tempo = Timestamp.now().seconds + giorniInSecondi;
		setDoc(
			doc(db, 'users', uid),
			{
				banTime: tempo
			},
			{ merge: true }
		).then(() => {
			// Si elimina la segnalazione
			deleteDoc(doc(db, 'segnalazioniDomande', oggettoSegnalazione.segnalazione.id));
			// Rimuovere localmente la recensione
			risolviSegnalazioneDomanda(oggettoSegnalazione.segnalazione.id);
			// Si elimina la domanda e le risposte
			eliminaDomanda();
			console.log('Utente sospeso per: ', giorniSospensione);
		});
	};
</script>

<div in:fly={{ y: 100, duration: 1000 }} out:fade class="domanda">
	<div class="up-part">
		<div
			class="avatar"
			on:click={() => redirectProfilo(oggettoSegnalazione.domanda.data().idAutore)}
		>
			<img src={oggettoSegnalazione.domanda.data().avatar} alt="" />
		</div>
		<div class="titolo-nome">
			<p class="titolo-domanda">{oggettoSegnalazione.domanda.data().titolo}</p>
			<p>{oggettoSegnalazione.domanda.data().nome}</p>
		</div>

		<button on:click={eliminaDomanda} class="delete-domanda">🗑️</button>
	</div>

	<div class="down-part">
		<div class="contenuto">
			<p>{oggettoSegnalazione.domanda.data().contenuto}</p>
		</div>
		<div class="box-bottoni">
			<button on:click={displayReport}> Mostra segnalazione </button>
			<div class="div-sospensione">
				<!-- Form per la sospensione -->
				<form
					action=""
					on:submit|preventDefault={() => setBanTime(oggettoSegnalazione.domanda.data().idAutore)}
				>
					<input
						class="input-giorni"
						required
						bind:value={giorniSospensione}
						min="1"
						type="number"
						name="giorni"
						id="giorni-sospensione"
						placeholder="Giorni di sospensione"
					/>
					<button class="sospendi">Sospendi</button>
				</form>
			</div>
		</div>

		{#if segnalazioneMostrata}
			<SegnalazioneDomanda
				segnalazione={oggettoSegnalazione.segnalazione}
				{risolviSegnalazioneDomanda}
			/>
		{/if}
	</div>
</div>

<style>
	.domanda {
		border-radius: 0.5rem;
		padding: 0.5rem;
		box-shadow: var(--neumorphism);
		margin: 1rem;
	}

	.titolo-domanda {
		font-weight: 600;
		font-size: 1.4rem;
		margin-bottom: 0;
	}
	.up-part {
		display: flex;
		gap: 1rem;
		justify-content: left;
		align-items: center;
	}

	.delete-domanda {
		display: flex;
		justify-content: center;
		align-items: center;
		align-self: center;
		border-radius: 100%;
		font-weight: 600;
		font-size: 1.3rem;
		color: var(--alert);
		height: 50px;
		width: 50px;
		cursor: pointer;
		transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
		position: absolute;
		margin-left: -2rem;
		margin-top: -6rem;
		box-shadow: var(--innerNeu);
		background-color: var(--sfondo);
	}

	.delete-domanda:hover{
		transform: var(--premuto);
	}

	

	.avatar {
		max-width: 75px;
		max-height: 75px;
		border-radius: 100%;
		cursor: pointer;
		border: var(--bordo);
	}

	.avatar > img {
		width: 75px;
		height: 75px;
		border-radius: 100%;
		object-fit: cover;
	}

	.down-part {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
	}

	button {
		padding: 0.3rem;
		font-size: 1rem;
		border-radius: 0.3rem;
		cursor: pointer;
	}

	.contenuto {
		box-shadow: var(--innerNeu);
		border-radius: 10px;
		padding: 0.5rem;
		overflow-wrap: break-word;
	}

	.box-bottoni {
		display: flex;
		justify-content: space-between;
	}
</style>
