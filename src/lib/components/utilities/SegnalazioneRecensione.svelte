<script>
	import { auth, db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';
	import { recensioniSegnalate } from '$lib/stores/recensioniStore';

	import { addDoc, collection } from 'firebase/firestore';
import { afterUpdate } from 'svelte';

	// ID recensione da segnalare
	export let idRecensione;
	export let segnalato;

	let isOpen = false;
	let contenuto;

	const open = () => {
		isOpen = true;
	};

	const close = () => {
		isOpen = false;
	};

	// Per non fare scroll alla pagina sotto
	afterUpdate(() => {
		if (isOpen) document.body.style.overflowY = 'hidden';
		else document.body.style.overflowY = 'auto';
	});

	const mandaSegnalazione = () => {
		// Creo una segnalazione con i seguenti campi
		/*  
        -idRecensione
        -idSegnalatore
        -contenutoSegnalazione
        */

		// Check per evitare problemi
		if ($authStore.isLoggedIn) {
			let dati = {
				idRecensione: idRecensione,
				idSegnalatore: $authStore.user.uid,
				contenutoSegnalazione: contenuto
			};

			addDoc(collection(db, 'segnalazioniRecensioni'), dati).then(() => {
				// Aggiungo la segnalazione allo store
				recensioniSegnalate.update((oldReports) => [...oldReports, dati]);
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
					<p>Segnala recensione</p>
				</div>
			</slot>

			<div class="contenuto">
				<slot name="content" />
				<div class="domande">
					<form action="" on:submit|preventDefault={mandaSegnalazione}>
						<div class="domanda text-area">
							<p>Motiva la tua segnalazione <span class="material-icons"> report_problem </span></p>
							<textarea
								bind:value={contenuto}
								name="recensione"
								id="area-recensione"
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
		text-transform: uppercase;
		outline: none;
		padding: 0.5rem;
		border-radius: 6px;
		cursor: pointer;
		color: var(--sfondo);
		background-color: var(--alert);
	}

	.segnalazione:hover{
		box-shadow: var(--alertHover);
	}

	.segnalato {
		text-transform: uppercase;
		outline: none;
		padding: 0.5rem;
		border-radius: 0.5rem;
		cursor: pointer;
		color: var(--submit);
		border: var(--submit) solid;
	}
	.segnalato:hover {
		box-shadow: var(--neumorphism);
		transform: scale(1);
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
		z-index: 10;
		max-width: 100vw;
		border-radius: 0.3rem;
		background-color: var(--sfondo);
		box-shadow: var(--innerNeu);
		overflow: hidden;
		padding: 2rem;
		width: 80%;
		height: 80%;
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
		font-size: 2em;
		font-weight: 600;
		text-align: center;
	}
	.contenuto {
		overflow: auto;
		width: 100%;
	}

	form {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.domanda {
		border-radius: 0.8rem;
		padding: 0.5rem;
		justify-content: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 1.2em;
	}

	.domanda > p{
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1em;
	}


	textarea {
		resize: none;
		border: none;
		width: 80%;
		font-size: 1rem;
		color: var(--testo);
		border-radius: 0.3rem;
		padding: 1rem;
		background-color: var(--sfondo);
		box-shadow: var(--innerNeu);
		outline: none;
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

	@media screen and (max-width:800px){
		.content-wrapper{
			width: 100%;
			height: 100%;
		}
	}
</style>
