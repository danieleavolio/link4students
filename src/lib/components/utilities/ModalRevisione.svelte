<script>
	import { db } from '$lib/firebaseConfig';

	import { authStore } from '$lib/stores/authStore';
	import { doc, setDoc } from 'firebase/firestore';
	import { afterUpdate } from 'svelte';

	let isOpen = false;
	let urlNuovo = '';

	// Per non fare scroll alla pagina sotto
	afterUpdate(() => {
		if (isOpen) document.body.style.overflowY = 'hidden';
		else document.body.style.overflowY = 'auto';
	});

	let caricamento = false;
	let messaggio = '';

	export let appunto;
	export let eliminaAppunto;

	/**
	 * Aggiunge l'appunto alla lista degli appunti del sito.
	 * il parametro REVISIONATO passa da false a true, e l'appunto diventa disponbiile
	 * all'utente all'interno del sito
	 */
	const revisionato = () => {
		// Cosa fare se l'appunto viene revisionato
		setDoc(
			doc(db, 'appunti', appunto.id),
			{
				revisionato: true,
				urlAppunti: { url: urlNuovo }
			},
			{ merge: true }
		)
			.then(() => {
				messaggio = 'Appunto revisionato con successo!';
			})
			.catch((error) => {
				messaggio = error.message;
			});
	};
	/**
	 * @function open
	 * Apre il modal
	 */
	const open = () => {
		isOpen = true;
	};
	/**
	 * @function close
	 * Chiude il modal
	 */
	const close = () => {
		isOpen = false;
	};
</script>

{#if $authStore.isLoggedIn}
	<slot name="trigger" {open}>
		<button class="domanda-button" on:click={open}>REVISIONA</button>
	</slot>
{/if}

{#if isOpen}
	<div class="modal">
		<div class="backdrop" on:click={close} />
		<div class="content-wrapper">
			<button class="close-button" on:click={close}>
				<span class="material-icons"> close </span>
			</button>
			<slot name="header">
				<div class="titolo">
					<p>Revisione per <span class="nome-appunto"> {appunto.data().titoloAppunti}</span></p>
				</div>
			</slot>
			{#if caricamento}
				<div class="loading-div" />
			{:else if messaggio == ''}
				<div class="contenuto">
					<slot name="content" />
					<div class="domande">
						<form action="" on:submit|preventDefault={revisionato}>
							<div class="titolo-container">
								<label for="input-url">Inserisci nuovo link</label>
								<input type="url" id="input-url" bind:value={urlNuovo} required />
							</div>
							<div class="submit-box">
								<button type="submit"> Conferma revisione </button>
							</div>
						</form>
						<div class="alternativa">
							<div class="div">
								<p class="oppure">Se l'appunto ha problemi come copyright o altro</p>
								<button on:click={eliminaAppunto} class="elimina" id="elimina-appunto"
									>Elimina</button
								>
							</div>
						</div>
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
	.nome-appunto {
		padding: 0.3em;
		background-color: var(--testo);
		color: var(--sfondo);
		border-radius: 0.2em;
		word-break: break-all;
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
		width: 80%;
		height: 80%;
		border-radius: 0.3rem;
		overflow: hidden;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	label {
		font-size: 1.3em;
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
		font-size: 1.5em;
		font-weight: 600;
		text-align: center;
		white-space: pre-wrap;
		line-height: 2em;
	}

	.titolo-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.5rem;
	}

	.titolo-container > input {
		padding: 0.4rem;
		font-size: 1rem;
	}

	.oppure {
		font-size: 1.2em;
		white-space: pre-line;
	}

	form {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		gap: 1rem;
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
		margin: 1rem;
		color: var(--submit);
	}

	.submit-box > button:hover {
		color: var(--sfondo);
		box-shadow: var(--submitHover);
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

	.alternativa {
		display: flex;
		flex-direction: column;
		text-align: center;
	}

	.elimina {
		white-space: nowrap;
		font-family: 'Roboto', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
		color: var(--alert);
		border-radius: 0.3em;
		font-size: 1.2rem;
		padding: 0.5rem 1rem;
		cursor: pointer;
	}

	.elimina:hover {
		color: var(--sfondo);
		box-shadow: var(--alertHover);
		background-color: var(--alert);
	}

	@media screen and (max-width: 650px) {
		.content-wrapper {
			width: 100%;
			height: 100%;
		}

		input {
			width: 80vw;
		}
	}
</style>
