<script>
	import { db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';
	import { esamiRecensiti } from '$lib/stores/recensioniStore';

	import {
		addDoc,
		collection,
		doc,
		getDoc,
		getDocs,
		increment,
		query,
		serverTimestamp,
		setDoc,
		where
	} from 'firebase/firestore';
	import { afterUpdate } from 'svelte';

	import SelectionForm from './SelectionForm.svelte';
	export let idCorso;
	export let nome;

	let isOpen = false;

	let difficolta = 3;
	let utilita = 3;
	let contenuto;
	let anonimo = false;

	let sending = false;


	// Per non fare scroll alla pagina sotto
	afterUpdate(() => {
		if (isOpen) document.body.style.overflowY = 'hidden';
		else document.body.style.overflowY = 'auto';
	});

	const open = () => {
		isOpen = true;
	};

	const close = () => {
		isOpen = false;
	};

	const calcolaMedia = (esame, difficolta, utilita) => {
		let numRecensioni;
		let mediaDifficolta;
		let mediaUtilita;
		if (esame.numRecensioni) {
			numRecensioni = esame.numRecensioni + 1;
		} else numRecensioni = 1;

		// Se esiste la media, allora salvo la vecchia e poi calcolo la nuova
		if (esame.mediaDifficolta) {
			let vecchiaMediaTot = esame.mediaDifficolta * esame.numRecensioni;
			mediaDifficolta = Math.floor((vecchiaMediaTot + difficolta) / numRecensioni);
		} else mediaDifficolta = difficolta;
		// Se esiste la media, allora salvo la vecchia e poi calcolo la nuova
		if (esame.mediaUtilita) {
			let vecchiaMediaTot = esame.mediaUtilita * esame.numRecensioni;
			mediaUtilita = Math.floor((vecchiaMediaTot + utilita) / numRecensioni);
		} else mediaUtilita = utilita;

		let datiMedia = {
			numRecensioni,
			mediaDifficolta,
			mediaUtilita
		};
		return datiMedia;
	};

	const mandaRecensione = () => {

		if (sending)
			return;

		sending = true;
		// Quando si invia una recensione, viene mandata su firebase
		getDoc(doc(db, 'users', $authStore.user.uid)).then((ref) => {
			let nome = ref.data().nome;
			let profilePic = ref.data().avatar;
			const data = {
				nome: nome,
				idCorso: idCorso,
				data: serverTimestamp(),
				contenuto: contenuto,
				votoDifficolta: difficolta,
				votoUtilita: utilita,
				anonimo: anonimo,
				// Mi salvo l'immagine per evitare di farmi moltissime query
				autore: {
					nome,
					avatar: profilePic,
					idAutore: $authStore.user.uid
				},
				likes: 0,
				dislikes: 0
			};
			// Prendo l'esame e aggiungo la nuova media calcolandola sul posto
			const q = query(collection(db, 'corsidelcdl'), where('codiceCorso', '==', idCorso));
			getDocs(q).then((snapshot) => {
				let datiMedia = calcolaMedia(snapshot.docs[0].data(), difficolta, utilita);
				// Ho il nuovo oggetto con la media nuova
				setDoc(snapshot.docs[0].ref, datiMedia, { merge: true }).then(() => {
					addDoc(collection(db, 'recensioni'), data)
						.then(async (esame) => {
							esamiRecensiti.update((oldEsami) => (oldEsami = [...oldEsami, idCorso]));
							// Aumento il numero di recensioni totali del sito
							setDoc(
								doc(db, 'statistiche', 'infoSito'),
								{
									numRecensioni: increment(1)
								},
								{ merge: true }
							);
							sending = false;
							close();
						})
						.catch((error) => {
							alert(error.message);
						});
				});
			});
		});
	};
</script>

<slot name="trigger" {open}>
	<button class="recensione" on:click={open}>Recensione</button>
</slot>

{#if isOpen}
	<div class="modal">
		<div class="backdrop" on:click={close} />
		<div class="content-wrapper">
			<button class="close-button" on:click={close}> <span class="material-icons">
				close
				</span> </button>
			<slot name="header">
				<div class="titolo">
					<p>Recensione per: {nome}</p>
				</div>
			</slot>

			<div class="contenuto">
				<slot name="content" />
				<div class="domande">
					<form action="" on:submit|preventDefault={mandaRecensione}>
						<div class="domanda">
							<p>
								Quanto reputi difficile l'esame? <span class="material-icons"> psychology </span>
							</p>
							<SelectionForm bind:difficolta icon={'🧠'} {utilita} />
						</div>

						<div class="domanda">
							<p>Quanto reputi utile l'esame? <span class="material-icons"> stars </span></p>
							<SelectionForm icon={'🎓'} bind:utilita {difficolta} />
						</div>

						<div class="domanda text-area">
							Lascia la tua recensione.
							<textarea
								bind:value={contenuto}
								name="recensione"
								id="area-recensione"
								cols="30"
								rows="4"
								maxlength="200"
								required
								wrap="hard"
								placeholder="Dai un tuo parere, fai un commento o suggerimento per l'esame! (Massimo 200 caratteri)"
							/>
						</div>
						<div class="submit-box">
							<button> Pubblica </button>
							<label for="anonimo"
								>Anonimo?
								<input bind:checked={anonimo} type="checkbox" id="anonimo" />
							</label>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.recensione {
		text-transform: uppercase;
		outline: none;
		padding: 0.5rem;
		border-radius: 6px;
		cursor: pointer;
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
		z-index: 20;
	}

	.backdrop {
		position: absolute;
		width: 100%;
		height: 100%;
		background: rgba(56, 56, 56, 0.4);
	}

	.content-wrapper {
		z-index: 10;
		max-width: 70vw;
		border-radius: 0.3rem;
		background-color: var(--sfondo);
		overflow-x: hidden;
		padding: 2rem;
		box-shadow: var(--innerNeu);
		display: flex;
		flex-direction: column;
		margin: auto;
	}

	.close-button {
		outline: none;
		font-size: 1.2rem;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		cursor: pointer;
		box-shadow: var(--innerNeu);
		align-self: center;
	}
	.titolo {
		font-size: 1.3rem;
		font-weight: 600;
		text-align: center;
	}
	.contenuto {
		overflow: hidden;
	}

	form {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.domanda {
		box-shadow: var(--innerNeu);
		border-radius: 10px;
		padding: 0.5rem;
		justify-content: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	textarea {
		resize: none;
		border: none;
		width: 80%;
		font-size: 1rem;
		background-color: var(--sfondo);
		box-shadow: var(--innerNeu);
		padding: 1rem;
		border-radius: 1rem;
		outline: none;
		color: var(--testo);
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
		font-size: 1rem;
		border-radius: 8px;
		cursor: pointer;
		padding: 5px 5px;
		color: var(--submit);
	}

	p {
		text-align: center;
	}

	@media screen and (max-width:500px){
		.content-wrapper{
			max-width: 100vw;
			height: 100vh;
			width: 100%;
		}
	}
</style>
