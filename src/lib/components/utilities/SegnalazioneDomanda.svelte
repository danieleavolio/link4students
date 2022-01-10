<script>
	import { db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';
	import { domandeSegnalate } from '$lib/stores/domandeStore';

	import { addDoc, collection } from 'firebase/firestore';

	// ID recensione da segnalare
	export let idDomanda;
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
        -idDomanda
        -idSegnalatore
        -contenutoSegnalazione
        */

		// Check per evitare problemi
		if ($authStore.isLoggedIn) {
			let dati = {
				idDomanda: idDomanda,
				idSegnalatore: $authStore.user.uid,
				contenutoSegnalazione: contenuto
			};

			addDoc(collection(db, 'segnalazioniDomande'), dati).then(() => {
				alert('Segnalazione inviata! 👌');
				// Aggiungo la segnalazione allo store
				domandeSegnalate.update((oldReports) => [...oldReports, dati]);
				close();
			});
		}
	};
</script>

{#if $authStore.isLoggedIn}
	{#if !segnalato}
		<slot name="trigger" {open}>
			<button class="segnalazione" on:click={open}>Segnalazione</button>
		</slot>
	{:else}
		<slot name="trigger" {open}>
			<button class="segnalato">Segnalata</button>
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
					<p>Segnala domanda</p>
				</div>
			</slot>

			<div class="contenuto">
				<slot name="content" />
				<div class="domande">
					<form action="" on:submit|preventDefault={mandaSegnalazione}>
						<div class="domanda text-area">
							<p>Motiva la tua segnalazione ‼️</p>
							<textarea
								bind:value={contenuto}
								name="domanda"
								id="area-domanda"
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
		box-shadow: var(--neumorphism);
		text-transform: uppercase;
		outline: none;
		padding: 0.5rem;
		border-radius: 6px;
		cursor: pointer;
		background-color: var(--alert);
		color: var(--sfondo);
	}

	.segnalato {
		box-shadow: var(--neumorphism);
		border: var(--bordo);
		text-transform: uppercase;
		outline: none;
		padding: 0.5rem;
		border-radius: 6px;
		cursor: pointer;
		background-color: var(--submit);
		color: var(--sfondo);
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
		background-color: var(--sfondo);
		overflow: hidden;
		box-shadow: var(--innerNeu);
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
</style>
