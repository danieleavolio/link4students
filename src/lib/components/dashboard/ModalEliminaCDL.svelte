<script>
	import { db } from '$lib/firebaseConfig';

	import { authStore } from '$lib/stores/authStore';
	import {
		collection,
		deleteDoc,
		doc,
		getDocs,
		increment,
		query,
		setDoc,
		where
	} from 'firebase/firestore';

	let isOpen = false;
	let caricamento = false;
	let messaggio = '';

	export let corso;

	/**
	 * Si prendono i dati del singolo corso e si effettuano delle query per prendere i dati innestati nei vari documenti
	 * @param singoloCorso il corso da cui prendere i dati.
	 */
	const eliminaRecensioni = (singoloCorso) => {
		let queryRecensioni = query(
			collection(db, 'recensioni'),
			where('idCorso', '==', singoloCorso.data().codiceCorso)
		);
		getDocs(queryRecensioni).then((recensioni) => {
			// Per ogni recensione, mi prendo le reazioni e le cancello.
			recensioni.docs.forEach((recensione) => {
				const queryReazioni = query(
					collection(db, 'votiRecensioni'),
					where('idRecensione', '==', recensione.id)
				);
				getDocs(queryReazioni).then((reazioni) => {
					reazioni.docs.forEach((reazione) => {
						deleteDoc(reazione.ref).then(() => {
							console.log('Eliminata reazione');
						});
					});
				});
				// Per ogni reazione, mi prendo le segnalazioni e le cancello
				const querySegnalazioni = query(
					collection(db, 'segnalazioniRecensioni'),
					where('idRecensione', '==', recensione.id)
				);
				getDocs(querySegnalazioni).then((segnalazioni) => {
					segnalazioni.docs.forEach((segnalazione) => {
						deleteDoc(segnalazione.ref).then(() => {
							console.log('Segnalazione elimiata');
						});
					});
				});
				// Elimino la singola recensione
				deleteDoc(recensione.ref);
				setDoc(
					doc(db, 'statistiche', 'infoSito'),
					{
						numRecensioni: increment(-1)
					},
					{ merge: true }
				);
			});
		});
	};

	const eliminaDomande = (singoloCorso) => {
		let queryDomande = query(
			collection(db, 'domande'),
			where('idCorso', '==', singoloCorso.data().codiceCorso)
		);
		getDocs(queryDomande).then((domande) => {
			domande.docs.forEach((domanda) => {
				// Per ogni domanda, facciamo la query sulle risposte
				const queryRisposte = query(
					collection(db, 'risposte'),
					where('idDomanda', '==', domanda.id)
				);
				getDocs(queryRisposte).then((risposte) => {
					// Per ogni risposta elimino la docRef
					risposte.docs.forEach((risposta) => {
						deleteDoc(risposta.ref).then(() => {
							console.log('Risposta eliminata');
						});
					});
				});
				// Per ogni domanda, faccio la query sulle segnalazioni
				const querySegnalazioni = query(
					collection(db, 'segnalazioniDomande'),
					where('idDomanda', '==', domanda.id)
				);
				getDocs(querySegnalazioni).then((segnalazioni) => {
					// Per ogni segnalazione, elimino la docRef
					segnalazioni.docs.forEach((segnalazione) => {
						deleteDoc(segnalazione.ref).then(() => {
							console.log('Segnalazione eliminata');
						});
					});
				});
				// Elimino la singola domanda
				deleteDoc(domanda.ref);
			});
		});
	};

	const eliminaAppunti = (singoloCorso) => {
		const queryAppunti = query(
			collection(db, 'appunti'),
			where('idCorso', '==', singoloCorso.data().codiceCorso)
		);
		// Prendo tutti gli appunti del corso
		getDocs(queryAppunti).then((appunti) => {
			appunti.forEach((appunto) => {
				const queryReazioni = query(
					collection(db, 'votiAppunti'),
					where('idAppunto', '==', appunto.id)
				);
				// Elimino ogni reazione agli appunti
				getDocs(queryReazioni).then((reazioniAppunti) => {
					reazioniAppunti.docs.forEach((reazione) => {
						deleteDoc(reazione.ref).then(() => {
							console.log('Reazione eliminata');
						});
					});
				});
				// Elimino il singolo appunto
				deleteDoc(appunto.ref);
				setDoc(
					doc(db, 'statistiche', 'infoSito'),
					{
						numAppunti: increment(-1)
					},
					{ merge: true }
				);
			});
		});
	};

	const eliminaCorso = async () => {
		// Quando un corso di laurea viene eliminato
		// Va fatto tutto a ritroso
		// Vanno presi tutti i corsi del CDL singolarmente
		// Per ogni corso, eliminare TUTTE le interazioni di quel corso con
		// - APPUNTI
		// - DOMANDE
		// - RECENSIONI
		// Successivamente, si devono eliminare tutti i singoli corsi
		// Poi, infine, eliminare il CDL
		//---
		caricamento = true;
		const queryCorsi = query(collection(db, 'corsidelcdl'), where('cdl', '==', corso.id));
		await getDocs(queryCorsi)
			.then((corsi) => {
				corsi.docs.forEach((singoloCorso) => {
					// Per ogni corso chiamo le dovute funzioni
					eliminaRecensioni(singoloCorso);
					eliminaDomande(singoloCorso);
					// TO DO --> ELIMINA APPUNTI
					eliminaAppunti(singoloCorso);
				});
			})
			.then(() => {
                // Quando viene eliminato, si chiude perchè non esiste più il documento nella lista
                // Svelte aggiorna la lista quindi elimina dal DOM l'elemento e la finestra scompare
				deleteDoc(corso.ref).then(() => {
					caricamento = false;
				}).catch((error)=>{
                    messaggio = error.message;
                });
			});
	};

	const open = () => {
		isOpen = true;
		messaggio = '';
	};

	const close = () => {
		isOpen = false;
	};
</script>

{#if $authStore.isLoggedIn}
	<slot name="trigger" {open}>
		<button class="domanda-button" on:click={open}>Elimina</button>
	</slot>
{/if}

{#if isOpen}
	<div class="modal">
		<div class="backdrop" on:click={close} />
		<div class="content-wrapper">
			<button class="close-button" on:click={close}> ❌ </button>
			<slot name="header">
				<div class="titolo">
					<p>Vuoi davvero eliminare {corso.data().nome}</p>
				</div>
			</slot>
			{#if caricamento}
				<div class="loading-div" />
			{:else if messaggio == ''}
				<div class="contenuto">
					<slot name="content" />
					<div class="scelte">
						<button on:click={eliminaCorso} class="si bottone">SI</button>
						<button on:click={close} class="no bottone">NO</button>
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
		border-radius: 6px;
		outline: none;
		cursor: pointer;
	}

	.domanda-button:hover{
		color: var(--sfondo);
		box-shadow: var(--alertHover);
		background-color: var(--alert);
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
		background-color: white;
		overflow: hidden;
		padding: 2rem;
		display: flex;
		flex-direction: column;
	}

	.close-button {
		outline: none;
		font-size: 1.2rem;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		cursor: pointer;
		position: absolute;
		margin-left: -3rem;
		margin-top: -3rem;
		box-shadow: var(--innerNeu);
	}
	.titolo {
		font-size: 1.3rem;
		font-weight: 600;
		text-align: center;
	}

	.scelte {
		display: flex;
		gap: 1rem;
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	.contenuto {
		overflow: auto;
	}

	.loading-div {
		border: var(--testo) solid 10px;
		border-top: solid var(--sfondo) 10px;
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

	.bottone {
		font-size: 2rem;
		border-radius: 0.5rem;
		cursor: pointer;
		outline: none;
		width: 20%;
	}
	.si {
		background-color: var(--alert);
		color: white;
	}

	.si:hover{
		color: var(--sfondo);
		box-shadow: var(--alertHover);
		background-color: var(--alert);
	}

	.no {
		background-color: var(--sfondo);
	}
</style>
