<script>
	import { db } from '$lib/firebaseConfig';
	import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
	import { fly } from 'svelte/transition';
	let verificando = false;
	let progress;
	let verificato = false;

	const checkMediaEsame = async () => {
		const queryEsami = query(collection(db, 'corsidelcdl'));
		let esami = await getDocs(queryEsami);

		// Per ogni esame, controllo la media
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

			if (mediaCorrente == null || mediaCalcolata == NaN) {
				// fai niente
			} else {
				// Se la media è errata, sostituiscila con quella corretta
				await setDoc(
					doc(db, 'corsidelcdl', esame.id),
					{
						mediaVoti: mediaCalcolata
					},
					{ merge: true }
				);
			}
			progress.value += 50 / esami.docs.length;
		}
	};

	const checkVoti = async () => {
		const queryEsami = query(collection(db, 'corsidelcdl'));
		let esami = await getDocs(queryEsami);

		// Per ogni esame, controlla che la media dei voti difficolta e utilita sia corretta
		// Altrimenti sostituiscila
		for (const esame of esami.docs) {
			let utilitaCorrente = esame.data().mediaUtilita;
			let difficoltaCorrente = esame.data().mediaDifficolta;

			//Quoziente
			let mediaUtilita = 0;
			let mediaDifficolta = 0;
			//Dividendo
			let sommaUtilita = 0;
			let sommaDifficolta = 0;
			// Divisore
			let numeroRecensioni = 0;
			// Inizio
			// Per ogni esame, prendo le recensioni di quell'esame;
			let queryRecensioni = query(
				collection(db, 'recensioni'),
				where('idCorso', '==', esame.data().codiceCorso)
			);
			let recensioniEsame = await getDocs(queryRecensioni);
			numeroRecensioni = recensioniEsame.docs.length;
			// Se non ci sono voti, sicuramente sarà 0
			if (numeroRecensioni == 0) {
				await setDoc(
					doc(db, 'corsidelcdl', esame.id),
					{
						mediaUtilita: 0,
						mediaDifficolta: 0
					},
					{ merge: true }
				);
			} else {
				// Se ha voti, calcola.

				for (const recensione of recensioniEsame.docs) {
					sommaUtilita += recensione.data().votoUtilita;
					sommaDifficolta += recensione.data().votoDifficolta;
				}
				// Dopo aver preso le somme, faccio la media;
				mediaUtilita = Math.floor(sommaUtilita / numeroRecensioni);
				mediaDifficolta = Math.floor(sommaDifficolta / numeroRecensioni);

				// Controllo che sia uguale, altrimenti cambio.

				if (mediaUtilita == utilitaCorrente && mediaDifficolta == difficoltaCorrente) {
				} else {
					await setDoc(
						doc(db, 'corsidelcdl', esame.id),
						{
							mediaUtilita,
							mediaDifficolta
						},
						{ merge: true }
					);
				}
			}
			progress.value += 50 / esami.docs.length;
		}
	};

	/**
	 * Per ogni esame, controlla che la somma di tutti gli esami libretto diviso il numeron sia uguale alla media del voto.
	 * Per ogni esame, controlla che la media delle recensioni sia corretta.
	 */
	const controllaTutto = async () => {
		verificando = true;
		await checkMediaEsame();
		await checkVoti();
		verificando = false;
		verificato = true;
	};
</script>

<div class="warning-side">
	<h1>Attenzione</h1>
	<p>
		Clicca il pulsante per fare una verifica dei dati. Il processo può richiedere un po' di tempo
	</p>
	<!-- Per firebase, sono anche 1000 letture probabilmente -->

	{#if verificando}
		<progress bind:this={progress} id="prog" value="1" max="100" />
		{#if progress != null}
			<label for="prog">{Math.floor(progress.value)}%</label>
		{/if}
	{:else}
		<button on:click={controllaTutto} class="warning-button"
			>CONTROLLO PERIODICO DATI <span class="material-icons"> cached </span></button
		>
	{/if}

	{#if verificato}
		<p transition:fly class="verify-done">Verifica e modifica effettuata con successo <span class="material-icons">
			check_circle_outline
			</span></p>
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

	.verify-done{
		display: flex;
		justify-content: center;
		align-items: center;
	}

	::-webkit-progress-bar {
		background-color: var(--sfondo);
		box-shadow: var(--innerNeu);
		height: 30px;
		border-radius: 0.5em;
		border: var(--bordo);
	}

	::-webkit-progress-value {
		background-color: var(--testo);
		border-radius: 0.5em;
		transition: all 0.2s ease;
	}
</style>
