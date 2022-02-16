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
import { afterUpdate } from 'svelte';

	let isOpen = false;
	let caricamento = false;
	let messaggio = '';

	export let corso;


	// Per non fare scroll alla pagina sotto
	afterUpdate(() => {
		if (isOpen) document.body.style.overflowY = 'hidden';
		else document.body.style.overflowY = 'auto';
	});
	/**
	 * Si prendono i dati del singolo corso e si effettuano delle query per prendere i dati innestati nei vari documenti.
	 * Si fanno 2 query:
	 * - La prima sulle reazioni
	 * - La seconda sulle segnalazioni
	 * Dopo aver cancellato ogni singolo elemento ottenuto dalle query, si procede ad eliminare il singolo documento, cioè la recensione.
	 * @param singoloCorso il corso da cui prendere i dati.
	 */
	const eliminaRecensioni = async (singoloCorso) => {
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
	/**
	 * Si prendono i dati del singolo corso e si effettuano delle query per prendere i dati innestati nei vari documenti.
	 * Si fanno 2 query:
	 * - La prima sulle risposte
	 * - La seconda sulle segnalazioni
	 * Dopo aver cancellato ogni singolo elemento ottenuto dalle query, si procede ad eliminare il singolo documento, cioè la domanda.
	 * @param singoloCorso il corso da cui prendere i dati.
	 */
	const eliminaDomande = async (singoloCorso) => {
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
						});
					});
				});
				// Elimino la singola domanda
				deleteDoc(domanda.ref);
			});
		});
	};
	/**
	 * Si prendono i dati del singolo corso e si effettuano delle query per prendere i dati innestati nei vari documenti.
	 * Si fanno 2 query:
	 * - La prima sulle reazioni
	 * - La seconda sulle segnalazioni
	 * Dopo aver cancellato ogni singolo elemento ottenuto dalle query, si procede ad eliminare il singolo documento, cioè l'appunto.
	 * @param singoloCorso il corso da cui prendere i dati.
	 */
	const eliminaAppunti = async (singoloCorso) => {
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
    /**
     * La funzione chiama 3 funzioni asincrone.
     * Fa in modo che prima che possano essere eliminati alcuni elementi, ne vengano eliminati degli altri.
     * Questo per fare in modo che la recensione quando viene eliminata completamente, non ha elementiche sono rimasti ancora
     * interi nonostante l'eliminazione chiamata.
     * @function eliminaRecensioni
     * @function eliminaDomande
     * @function eliminaAppunti
     * @var corso
     */
	const eliminaCorso = async () => {
		caricamento = true;
		await eliminaRecensioni(corso).then(() => {
			eliminaDomande(corso).then(() => {
				eliminaAppunti(corso).then(() => {
					deleteDoc(corso.ref)
						.then(() => {
						})
						.catch((err) => {});
				});
			});
		});
	};
    /**
     * Apre il Modal.
     */
	const openElimina = () => {
		isOpen = true;
		messaggio = '';
	};

    /**
     * Chiude il Modal
     */
	const close = () => {
		isOpen = false;
	};
</script>

{#if $authStore.isLoggedIn}
	<slot name="trigger" {openElimina}>
		<button class="domanda-button" on:click={openElimina}>Elimina</button>
	</slot>
{/if}

{#if isOpen}
	<div class="modal">
		<div class="backdrop" on:click={close} />
		<div class="content-wrapper">
			<button class="close-button" on:click={close}> <span class="material-icons">
				close
				</span> </button>
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
		color: var(--alert);
		outline: none;
		cursor: pointer;
	}

	.domanda-button:hover{
		box-shadow: var(--alertHover);
		color:var(--sfondo);
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
		z-index: 20;
	}

	.backdrop {
		position: absolute;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
	}

	.content-wrapper {
		z-index: 20;
		max-width: 100vw;
		width: 100%;
		height: 100%;
		border-radius: 0.3rem;
		overflow: hidden;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.close-button {
		outline: none;
		font-size: 1.2rem;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		cursor: pointer;
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
width: 80%;		
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

	.bottone {
		font-size: 2rem;
		border-radius: 0.5rem;
		cursor: pointer;
		border: none;
		outline: none;
		width: 100%;
		margin: 1rem;
	}
	.si {
		background-color: var(--alert);
		color: var(--sfondo);
	}

	.si:hover{
		box-shadow: var(--alertHover);
	}

	@media screen and (max-width: 500px) {
		.domanda-button{
			width: fit-content;
			place-self: center;
		}
		
	}

	
</style>
