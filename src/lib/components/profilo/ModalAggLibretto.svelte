<script>
	import { db } from '$lib/firebaseConfig';

	import { authStore } from '$lib/stores/authStore';
	import {
		addDoc,
		collection,
		doc,
		getDoc,
		getDocs,
		increment,
		query,
		setDoc,
		where
	} from 'firebase/firestore';

	let isOpen;
	let caricamento = false;
	let messaggio = '';

	let corsoScelto;
	let voto;
	let lode = false;

	$: if (voto != 30) {
		lode = false;
	}

	export let profilo;
	export let librettoEsami;
	let listaEsamiPossibili = [];

	/**
	 * Cambia la media del singolo corso in base al libretto
	 */
	const cambiaMediaVotoEsame = () => {
		getDoc(doc(db, 'corsidelcdl', corsoScelto.id)).then((corso) => {
			// Ho il corso.. devo prendermi i dati

			if (corso.data().mediaVoti == null) {
				// Non è mai esistito un voto, allora.
				let mediaVoti = voto;
				let numeroVoti = 1;

				let data = {
					mediaVoti,
					numeroVoti
				};

				setDoc(doc(db, 'corsidelcdl', corsoScelto.id), data, { merge: true });
			}
			// Se invece esistono già voti registrati nei libretti degli altri
			else {
				let vecchioTotale = corso.data().mediaVoti * corso.data().numeroVoti;
				let nuovoNumVoti = corso.data().numeroVoti + 1;
				let nuovaMedia = Math.round((vecchioTotale + voto) / nuovoNumVoti);
				// ho la nuova media
				// ho il nuovo numero di recensioni
				let data = {
					mediaVoti: nuovaMedia,
					numeroVoti: increment(1)
				};
				// posso settare il doc
				setDoc(doc(db, 'corsidelcdl', corsoScelto.id), data, { merge: true });
			}
		});
	};

	const aggiungiAlLibretto = async () => {
		let dati = {
			uidUtente: $authStore.user.uid,
			codiceCorso: corsoScelto.data().codiceCorso,
			nomeCorso: corsoScelto.data().nome,
			voto: voto,
			lode: lode,
			uidCorso: corsoScelto.id
		};

		// Aggiungo l'esame al libretto
		await addDoc(collection(db, 'esamiLibretto'), dati).then((docum) => {
			messaggio = 'Esame aggiunto al libretto!';
		});

		// Gestione media voto
		cambiaMediaVotoEsame();
	};
	// Gli esami possibili che posso prendere dal corso di laurea

	const open = () => {
		const queryEsami = query(
			collection(db, 'corsidelcdl'),
			where('cdl', '==', profilo.corsoDiLaurea)
		);
		getDocs(queryEsami)
			.then((esami) => {
				listaEsamiPossibili = esami.docs;
			})
			// Faccio le azioni qui altrimenti la lista si popolerebbe dopo che faccio il filtro
			.then(() => {
				isOpen = true;
				messaggio = '';

				librettoEsami.forEach((esame) => {
					listaEsamiPossibili = listaEsamiPossibili.filter(
						(esamePossibile) => esamePossibile.data().codiceCorso != esame.data().codiceCorso
					);
				});
			});
	};

	const close = () => {
		isOpen = false;
		pulisciCampi();
	};

	const pulisciCampi = () => {
		voto = '';
	};
</script>

{#if $authStore.isLoggedIn}
	<slot name="trigger" {open}>
		<button class="domanda-button" on:click={open}>Aggiungi Esame al Libretto</button>
	</slot>
{/if}

{#if isOpen}
	<div class="modal">
		<div class="backdrop" on:click={close} />
		<div class="content-wrapper">
			<button class="close-button" on:click={close}> ❌ </button>
			<slot name="header">
				<div class="titolo">
					<p>Aggiungi un Esame al tuo libretto</p>
				</div>
			</slot>
			{#if caricamento}
				<div class="loading-div" />
			{:else if messaggio == ''}
				<div class="contenuto">
					<slot name="content" />
					<div class="domande">
						{#if listaEsamiPossibili.length != 0}
							<form action="" on:submit|preventDefault={aggiungiAlLibretto}>
								<div class="inputs-container">
									<select required bind:value={corsoScelto} name="esame" id="scegli-esame">
										{#each listaEsamiPossibili as esame (esame.id)}
											<option selected value={esame}>{esame.data().nome}</option>
										{/each}
									</select>
									<div class="voto">
										<div >
											<input
												required
												bind:value={voto}
												type="number"
												name="voto"
												id="voto"
												placeholder="18-30"
												min="18"
												max="30"
												class="input-voto"
											/>
										</div>
										<label for="lode">Lode?</label>
										<input
											disabled={voto != 30}
											bind:checked={lode}
											type="checkbox"
											name="lode"
											id="lode"
										/>
									</div>
								</div>

								<div class="submit-box">
									<button type="submit"> Aggiungi CDL </button>
								</div>
							</form>
						{:else}
							<div class="finito">
								<p>Non hai esami da aggiungere!</p>
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<div class="message-div">
					<p>{messaggio}</p>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.domanda-button {
		display: flex;
		align-self: center;
		padding: 0.4rem;
		background-color: var(--sfondo);
		box-shadow: var(--neumorphism);
		color: var(--testo);
		border: var(--bordo);
		border-radius: 6px;
		outline: none;
		cursor: pointer;
		margin: auto;
		font-size: 1.2rem;
		transition: var(--velocita);
		margin: 1rem;
	}

	.domanda-button:hover{
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
	}

	.backdrop {
		position: absolute;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
	}

	.content-wrapper {
		z-index: 10;
		max-width: 70vw;
		width: 50%;
		border-radius: 0.3rem;
		background-color: var(--sfondo);
		box-shadow: var(--innerNeu);
		overflow: hidden;
		padding: 2rem;
		display: flex;
		flex-direction: column;
	}

	.close-button {
		outline: none;
		font-size: 1.2rem;
		border: var(--bordo);
		box-shadow: var(--innerNeu);
		border-radius: 50%;
		width: 50px;
		height: 50px;
		cursor: pointer;
		position: absolute;
		margin-left: -3rem;
		margin-top: -3rem;
		transition: var(--velocita);
	}

	.close-button:hover{
		transform: var(--premuto);
	}
	.titolo {
		font-size: 1.3em;
		font-weight: 600;
		text-align: center;
	}

	.inputs-container {
		display: flex;
		justify-content: left;
		gap: 0.5rem;
	}

	.contenuto {
		overflow: auto;
	}

	form {
		font-size: 1rem;
		text-align: left;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		gap: 1rem;
		font-size: 1.1rem;
		justify-content: center;
		align-items: center;
	}

	input,
	select {
		font-size: 1.3em;
		width: fit-content;
		background-color: var(--sfondo);
		border-radius: 0.5rem;
		outline: none;
		border: var(--bordo);
		box-shadow: var(--innerNeu);
	}

	option{
		background-color: var(--sfondo);
	}

	.input-voto{
		width: 100px;;
	}
	

	.voto {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	.submit-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin: 0 1rem;
	}

	.submit-box > button {
		background-color: var(--sfondo);
		box-shadow: var(--neumorphism);
		border: var(--bordo);
		color: var(--submit);
		font-size: 1rem;
		border-radius: 8px;
		cursor: pointer;
		padding: 5px 5px;
		transition: var(--velocita);
	}

	.submit-box > button:hover{
		box-shadow: var(--innerNeu);
	}

	.loading-div {
		border: white solid 10px;
		border-top: solid black 10px;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		animation: loading 1s linear infinite;
		align-self: center;
	}

	@keyframes loading {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.message-div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.message-div > p {
		font-family: 'Roboto', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
		text-align: center;
		background-color: black;
		padding: 0;
		border-radius: 4px;
		font-weight: 700;
		font-size: 2rem;
		color: white;
	}
</style>
