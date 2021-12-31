<script>
	import { db } from '$lib/firebaseConfig';

	import { authStore } from '$lib/stores/authStore';
	import { addDoc, collection } from 'firebase/firestore';

	let isOpen = false;
	export let cdl;
	export let listaCorsi;

	let caricamento = false;
	let messaggio = '';

	let nomeCorso;
	let annoCorso;
	let cfu;
	let codiceCorso;
	let professore;
	let oreInsegnamento='';
	let linkScheda='';

    /**
     * Aggiunge il corso al database firebase.
     * Se il corso esiste già, mostra un messaggio di errore tramite la variabile messaggio
     */
	const aggiungiCorso = () => {
		if (listaCorsi.find((elem) => elem.data().codiceCorso == codiceCorso)) {
			messaggio = 'Corso già esistente! ⛔';
		} else {
			let dati = {
				anno: annoCorso,
				cdl: cdl.id,
				cfu: cfu,
				codiceCorso: codiceCorso,
				nome: nomeCorso,
				professore: professore,
				oreInsegnamento: oreInsegnamento,
				linkScheda: linkScheda
			};

			addDoc(collection(db, 'corsidelcdl'), dati)
				.then(() => {
					messaggio = `Corso aggiunto con successo a ${cdl.data().nome} `;
				})
				.catch((error) => {
					messaggio = error.message;
				});
		}
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
		<button class="domanda-button" on:click={open}>Aggiungi Corso</button>
	</slot>
{/if}

{#if isOpen}
	<div class="modal">
		<div class="backdrop" on:click={close} />
		<div class="content-wrapper">
			<button class="close-button" on:click={close}> ❌ </button>
			<slot name="header">
				<div class="titolo">
					<p>Aggiungi un Corso a <span>{cdl.data().nome}</span></p>
				</div>
			</slot>
			{#if caricamento}
				<div class="loading-div" />
			{:else if messaggio == ''}
				<div class="contenuto">
					<slot name="content" />
					<div class="domande">
						<form action="" on:submit|preventDefault={aggiungiCorso}>
							<div class="inputs-container">
								<label for="input-nome">Inserisci il nome del Corso</label>
								<input
									type="text"
									id="input-nome"
									bind:value={nomeCorso}
									required
									placeholder="Fondamenti di ..."
								/>
								<label for="input-anno">Inserisci l'anno del Corso</label>
								<input
									type="number"
									id="input-anno"
									bind:value={annoCorso}
									required
									min="1"
									max="6"
									placeholder="1..2..3.."
								/>
								<label for="input-cfu">Inserisci i CFU del Corso</label>
								<input
									type="number"
									id="input-cfu"
									bind:value={cfu}
									required
									min="1"
									max="30"
									placeholder="3..6..12"
								/>
								<label for="input-codice">Inserisci il codice del Corso</label>
								<input
									type="number"
									id="input-codice"
									bind:value={codiceCorso}
									required
									placeholder="XXXXXXXX"
								/>
								<label for="input-nomeprof">Inserisci il nome dell'insegnante</label>
								<input
									type="text"
									id="input-nomeprof"
									bind:value={professore}
									required
									placeholder="Michele Poggi"
								/>
								<label for="input-ore">Inserisci (se sono disponibili) le ore di insegnamento</label
								>
								<input
									type="number"
									id="input-ore"
									bind:value={oreInsegnamento}
									placeholder="Opzionale.."
								/>
								<label for="input-scheda"
									>Inserisci (se esiste) il link alla scheda di insegnamento</label
								>
								<input
									type="url"
									id="input-scheda"
									bind:value={linkScheda}
									placeholder="Opzionale.."
								/>
							</div>
							<!-- let nomeCorso;
                            let annoCorso;
                            let cfu;
                            let codiceCorso;
                            let professore;
                            let oreInsegnamento;
                            let linkScheda; -->
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
		background-color: blue;
		border-radius: 6px;
		color: white;
		border: none;
		outline: none;
		cursor: pointer;
        margin: auto;
        font-size: 1.2rem;
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

	.inputs-container {
		display: flex;
		flex-direction: column;
		justify-content: left;
		gap: 0.5rem;
	}

	.inputs-container > input {
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
		background-color: blue;
		font-size: 1rem;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		padding: 5px 5px;
		color: white;
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

	span {
		background-color: blue;
		color: white;
		border-radius: 0.2rem;
	}

</style>


