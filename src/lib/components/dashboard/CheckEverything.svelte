<script>
	import { db } from '$lib/firebaseConfig';

	import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

	let verificando = false;
	let progress;

	const checkMediaEsame = async () => {
		const queryEsami = query(collection(db, 'corsidelcdl'));
		let esami = await getDocs(queryEsami);

		// Per ogni esame, controllo la media
		progress.value = 20;
		for (const esame of esami.docs) {
			let mediaCorrente = esame.data().mediaVoti;
			let mediaCalcolata = 0;
			let sommaCalcolata = 0;
			// Controllo, per ogni esame, che ci siano il giusto numero di voti e la somma corretta
			const queryLibretto = query(
				collection(db, 'esamiLibretto'),
				where('uidCorso', '==', esame.id)
			);
			let esamiRegistrati = await getDocs(queryLibretto);
			for (const esameRegistrato of esamiRegistrati.docs)
				sommaCalcolata += esameRegistrato.data().voto;

			// Calcolo la media
			mediaCalcolata = Math.floor(sommaCalcolata / esamiRegistrati.docs.length);

			if (mediaCalcolata == mediaCorrente) console.log('media corretta');
			else if (mediaCorrente == null || mediaCalcolata == NaN) {
				console.log('No exams');
			} else {
				console.log('media erratA', ' - ', mediaCalcolata, ' - ', mediaCorrente, ' - ', esame.data().nome);
				// Se la media è errata, sostituiscila con quella corretta
				await setDoc(
					doc(db, 'corsidelcdl', esame.id),
					{
						mediaVoti: mediaCalcolata
					},
					{ merge: true }
				);
			}
		}

		progress = 40;
	};

	const checkVoti = async () =>{
		const queryEsami = query(collection(db, 'corsidelcdl'));
		let esami = await getDocs(queryEsami);

		progress = 60;
		for (const esame of esami.docs) {
			// TO-DO
		}

	}

	/**
	 * Per ogni esame, controlla che la somma di tutti gli esami libretto diviso il numeron sia uguale alla media del voto.
	 * Per ogni esame, controlla che la media delle recensioni sia corretta.
	 */
	const controllaTutto = () => {
		checkMediaEsame();
		checkVoti();
	};
</script>

<div class="warning-side">
	<h1>Attenzione</h1>
	<p>
		Clicca il pulsante per fare una verifica dei dati. Il processo può richiedere un po' di tempo
	</p>
	<!-- Per firebase, sono anche 1000 letture probabilmente -->
	<button on:click={controllaTutto} class="warning-button"
		>CONTROLLO PERIODICO DATI <span class="material-icons"> cached </span></button
	>
	{#if !verificando}
		<progress bind:this={progress} value="1" max="100" />
	{/if}
</div>

<style>
	.warning-side {
		box-shadow: var(--innerNeu);
		padding: 0.5em;
		margin: 0.5em;
		border-radius: 0.5em;
	}

	.warning-side {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.warning-side > h1 {
		color: var(--alert);
	}

	.warning-button {
		background-color: var(--alert);
		color: var(--sfodno);
		border-radius: 0.4em;
		font-size: 1.5em;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5em;
	}

	.warning-button:hover {
		box-shadow: var(--alertHover);
	}

	.warning-button:hover > span {
		animation: rotation 1s linear infinite;
	}

	@keyframes rotation {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	progress {
		border-radius: 0.5em;
		width: 80%;
		margin: 1em;
	}

	::-webkit-progress-bar {
		background-color: var(--sfondo);
		box-shadow: var(--innerNeu);
		height: 30px;
		border-radius: 0.5em;
		border: var(--bordo);
	}

	::-webkit-progress-value {
		background-color: var(--submit);
		border-radius: 0.5em;
	}
</style>
