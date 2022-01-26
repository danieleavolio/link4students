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
							.then(() => {})
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
			doc(db, 'banTimes', uid),
			{
				time: tempo
			},
			{ merge: true }
		).then(() => {
			// Si elimina la segnalazione
			deleteDoc(doc(db, 'segnalazioniDomande', oggettoSegnalazione.segnalazione.id));
			// Rimuovere localmente la recensione
			risolviSegnalazioneDomanda(oggettoSegnalazione.segnalazione.id);
			// Si elimina la domanda e le risposte
			eliminaDomanda();
		});
	};
</script>

<div in:fly={{ y: 100, duration: 1000 }} out:fade class="domanda">
	<div class="up-part">
		<div
			class="avatar"
			on:click={() => redirectProfilo(oggettoSegnalazione.domanda.data().idAutore)}
		>
			<img src={oggettoSegnalazione.domanda.data().autore.avatar} alt="" />
		</div>
		<div class="titolo-nome">
			<p class="titolo-domanda">{oggettoSegnalazione.domanda.data().titolo}</p>
			<p>{oggettoSegnalazione.domanda.data().autore.nome}</p>
		</div>

		<button on:click={eliminaDomanda} class="delete-domanda"
			><span class="material-icons"> delete </span></button
		>
	</div>

	<div class="down-part">
		<div class="contenuto">
			<p>{oggettoSegnalazione.domanda.data().contenuto}</p>
		</div>
		<div class="box-bottoni">
			<button class="show-report" on:click={displayReport}>
				Mostra segnalazione <span class="material-icons"> visibility </span>
			</button>
			<div class="div-sospensione">
				<!-- Form per la sospensione -->
				<form
					action=""
					on:submit|preventDefault={() =>
						setBanTime(oggettoSegnalazione.domanda.data().autore.idAutore)}
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
		width: 60vw;
	}

	.titolo-domanda {
		font-weight: 600;
		font-size: 1.4rem;
		margin-bottom: 0;
		white-space: pre-line;
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
		width: 40px;
		height: 40px;
		cursor: pointer;
		transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
		box-shadow: var(--innerNeu);
		background-color: var(--sfondo);
	}

	.delete-domanda:hover {
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

	.show-report {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1em;
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
		white-space: pre-line;
		width: 80%;
	}

	.box-bottoni {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}

	form{
		display: flex;
		gap: 0.5em;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		margin: 0.5em;
	}

	
	@media screen and (max-width:500px){
		.up-part{
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin: 1em;
		}
	}
</style>
