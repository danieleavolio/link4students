<script>
	import { goto } from '$app/navigation';
	import { db } from '$lib/firebaseConfig';
	import { deleteDoc, doc, setDoc, Timestamp } from 'firebase/firestore';

	import Segnalazione from './Segnalazione.svelte';

	export let oggettoSegnalazione;
    export let cambiaUtentiSegnalati

	let segnalazioneMostrata = false;
	let giorniSospensione;
	const displayReport = () => {
		segnalazioneMostrata = !segnalazioneMostrata;
	};

	const redirectProfilo = (id) => {
		goto(`/profilo/${id}`);
	};

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
            deleteDoc(doc(db,'segnalazioniUtenti',oggettoSegnalazione.segnalazione.id))
            // Rimuovere localmente la recensione
            cambiaUtentiSegnalati(oggettoSegnalazione.segnalazione.id);
			console.log('Utente sospeso per: ', giorniSospensione);
		});
	};
</script>

<div class="utente-dash">
	<div class="immagine-nome">
		<div class="immagine">
			<img
				on:click={() => redirectProfilo(oggettoSegnalazione.segnalazione.data().idSegnalato)}
				src={oggettoSegnalazione.utente.data().avatar}
				alt=""
			/>
		</div>
		<p>{oggettoSegnalazione.utente.data().nome}</p>
	</div>
	<button class="show-report" on:click={displayReport}>Mostra report 🛑</button>
	<div class="div-sospensione">
		<!-- Form per la sospensione -->
		<form
			action=""
			on:submit|preventDefault={() => setBanTime(oggettoSegnalazione.segnalazione.data().idSegnalato)}
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
	{#if segnalazioneMostrata}
		<Segnalazione segnalazione={oggettoSegnalazione.segnalazione} />
	{/if}
</div>

<style>
	.utente-dash {
		border-radius: 0.5rem;
		padding: 0.5rem;
		background-color: grey;
		max-width: 300px;
		width: 100%;
	}
	.immagine-nome {
		display: flex;
		gap: 1rem;
	}

	.immagine {
		width: 50px;
		height: 50px;
	}
	.immagine > img {
		width: 100%;
		height: 50px;
		object-fit: contain;
		cursor: pointer;
	}

	.show-report {
		border: black solid;
		outline: none;
		background: white;
		padding: 0.5rem 0.2rem;
		border-radius: 8px;
		cursor: pointer;
	}

	.div-sospensione {
		margin: 0.5rem 0;
	}

	.input-giorni {
		text-align: end;
		border-radius: 0.3rem;
		outline: none;
		border: none;
	}
</style>
