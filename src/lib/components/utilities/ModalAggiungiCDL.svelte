<script>
	import { db } from '$lib/firebaseConfig';

	import { authStore } from '$lib/stores/authStore';
	import { addDoc, collection, setDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';

	let isOpen = false;
	let nomeCorso = '';

	let caricamento = false;
	let messaggio = '';

	export let listaCorsi;

	const aggiungiCorso = () => {
		// Se il corso esiste, non aggiungerlo
		if (listaCorsi.find((elem) => elem.data().nome.toLowerCase() == nomeCorso.toLowerCase())) {
			messaggio = 'Corso già esistente nel database! ⛔';
		} else {
			// Se il corso non esiste, lo aggiungo.
			addDoc(collection(db, 'corsidilaurea'), {
				nome: nomeCorso
			})
				.then(() => {
					messaggio = 'Corso di Laurea aggiunto correttamente al Database!';
				})
				.catch((error) => {
					messaggio = error.message;
				});
		}
	};

	const open = () => {
		isOpen = true;
		nomeCorso = '';
		messaggio = '';
	};

	const close = () => {
		isOpen = false;
	};
</script>

{#if $authStore.isLoggedIn}
	<slot name="trigger" {open}>
		<button class="domanda-button" on:click={open}>Aggiungi CDL</button>
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
					<p>Aggiungi un Corso di Laurea</p>
				</div>
			</slot>
			{#if caricamento}
				<div class="loading-div" />
			{:else if messaggio == ''}
				<div class="contenuto">
					<slot name="content" />
					<div class="domande">
						<form action="" on:submit|preventDefault={aggiungiCorso}>
							<div class="titolo-container">
								<label for="input-nome">Inserisci il nome del Corso di Laurea</label>
								<input type="text" id="input-nome" bind:value={nomeCorso} required />
							</div>
							<div class="submit-box">
								<button type="submit"> Aggiungi CDL </button>
							</div>
						</form>
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
		color: var(--submit);
	}

	.domanda-button:hover{
		color: var(--sfondo);
		box-shadow: var(--submitHover);
		background-color: var(--submit);

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

	.titolo-container {
		display: flex;
		flex-direction: column;
		justify-content: left;
		gap: 0.5rem;
	}

	.titolo-container > input {
		padding: 0.4rem;
		font-size: 1rem;
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

	.submit-box > button:hover{
		box-shadow: var(--submitHover);
		background-color: var(--submit);
		color: var(--sfondo);
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
		background-color: var(--testo);
		padding: 0;
		border-radius: 4px;
		font-weight: 700;
		font-size: 2rem;
		color: var(--sfondo);
	}
</style>
