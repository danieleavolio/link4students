<script>
	import { db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';
	import { utentiSegnalati } from '$lib/stores/utentiStores';

	import { addDoc, collection } from 'firebase/firestore';

	// ID recensione da segnalare
	export let idUtente;
	export let segnalato;

	let isOpen = false;
	let contenuto;

	const open = () => {
		isOpen = true;
	};

	const close = () => {
		isOpen = false;
	};

	const mandaSegnalazione = () => {
		// Creo una segnalazione con i seguenti campi
		/*  
        -idUtente
        -idSegnalatore
        -contenutoSegnalazione
        */

		// Check per evitare problemi
		if ($authStore.isLoggedIn) {
			let dati = {
				idSegnalato: idUtente,
				idSegnalatore: $authStore.user.uid,
				contenutoSegnalazione: contenuto
			};

			addDoc(collection(db, 'segnalazioniUtenti'), dati).then(() => {
				alert('Utente segnalato! 👌');
				// Aggiungo la segnalazione allo store
				utentiSegnalati.update((oldReports) => [...oldReports, dati]);
				close();
			});
		}
	};
</script>

{#if $authStore.isLoggedIn}
	{#if !segnalato}
		<slot name="trigger" {open}>
			<button class="segnalazione" on:click={open}>Segnala</button>
		</slot>
	{:else}
		<slot name="trigger" {open}>
			<button class="segnalato">Segnalato</button>
		</slot>
	{/if}
{/if}

{#if isOpen}
	<div class="modal">
		<div class="backdrop" on:click={close} />
		<div class="content-wrapper">
			<button class="close-button" on:click={close}> ❌ </button>
			<slot name="header">
				<div class="titolo">
					<p>Segnala utente</p>
				</div>
			</slot>

			<div class="contenuto">
				<slot name="content" />
				<div class="domande">
					<form action="" on:submit|preventDefault={mandaSegnalazione}>
						<div class="domanda text-area">
							<p>Motiva la tua segnalazione‼️</p>
							<textarea
								bind:value={contenuto}
								name="segnalazione"
								id="area-segnalazione"
								cols="30"
								rows="4"
								maxlength="200"
								required
								wrap="hard"
								placeholder="Dai una motivazione per la segnalazione"
							/>
						</div>
						<div class="submit-box">
							<button> Invia segnalazione </button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.segnalazione {
		box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2), 5px 5px 5px rgba(255, 255, 255, 0.5);
		border: none;
		text-transform: uppercase;
		outline: none;
		padding: 0.5rem;
		border-radius: 6px;
		cursor: pointer;
		background-color: darkred;
		color: white;
	}

	.segnalato {
		box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2), 5px 5px 5px rgba(255, 255, 255, 0.5);
		border: none;
		text-transform: uppercase;
		outline: none;
		padding: 0.5rem;
		border-radius: 6px;
		cursor: pointer;
		background-color: blue;
		color: white;
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
		border-radius: 0.3rem;
		background-color: white;
		overflow: hidden;
		padding: 2rem;
	}

	.close-button {
		outline: none;
		font-size: 1.2rem;
		border: black solid;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		cursor: pointer;
		position: absolute;
		margin-left: -3rem;
		margin-top: -3rem;
	}
	.titolo {
		font-size: 1.3rem;
		font-weight: 600;
		text-align: center;
	}
	.contenuto {
		overflow: auto;
	}

	form {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.domanda {
		box-shadow: 0px 5px 3px 0px rgb(0 0 0 / 20%);
		border-radius: 10px;
		padding: 0.5rem;
		background: lightcyan;
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
		background-color: blue;
		font-size: 1rem;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		padding: 5px 5px;
		color: white;
	}
</style>
