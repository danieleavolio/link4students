<script lang="ts">
	import { db } from '$lib/firebaseConfig';

	import { doc, setDoc } from 'firebase/firestore';
import { afterUpdate } from 'svelte';
	import ContentCartaCorso from '../dashboard/ContentCartaCorso.svelte';

	export let corso;
	let isOpen = false;

	let caricamento = false;
	let messaggio = '';

	// @ts-ignore
	let nomeCorso = corso.data().nome;
	let annoCorso = corso.data().anno;
	let cfu = corso.data().cfu;
	let codiceCorso = corso.data().codiceCorso;
	let professore = corso.data().professore;
	let oreInsegnamento =
		corso.data().oreInsegnamento != undefined ? corso.data().oreInsegnamento : '';
	let linkScheda = corso.data().linkScheda != undefined ? corso.data().linkScheda : '';
	let cdl = corso.data().cdl;


	// Per non fare scroll alla pagina sotto
	afterUpdate(() => {
		if (isOpen) document.body.style.overflowY = 'hidden';
		else document.body.style.overflowY = 'auto';
	});
	
	const modificaCorso = () => {
		let dati = {
			anno: annoCorso,
			cdl: cdl,
			cfu: cfu,
			codiceCorso: codiceCorso,
			nome: nomeCorso,
			professore: professore,
			oreInsegnamento: oreInsegnamento,
			linkScheda: linkScheda
		};

		setDoc(doc(db, 'corsidelcdl', corso.id), dati, { merge: true })
			.then(() => {
				messaggio = `${nomeCorso} modificato con successo `;
			})
			.catch((error) => {
				messaggio = error.message;
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

<slot name="trigger" {open}>
	<ContentCartaCorso {open} {corso} />
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
					<p>Modifica informazioni <span>{corso.data().nome}</span></p>
				</div>
			</slot>
			{#if caricamento}
				<div class="loading-div" />
			{:else if messaggio == ''}
				<div class="contenuto">
					<slot name="content" />
					<div class="domande">
						<form action="" on:submit|preventDefault={modificaCorso}>
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

							<div class="submit-box">
								<button type="submit"> Salva modifiche </button>
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
		text-align:center;
	}

	.close-button {
		outline: none;
		font-size: 1.2rem;
		border-radius: 100%!important;
		width: 50px;
		height: 50px;
		cursor: pointer;
		box-shadow: var(--innerNeu);
	}

	.material-icons{
		border-radius: 100%;
		background-color: var(--sfondo);
		color: var(--alert);
		border: var(--bordo);
		box-shadow: var(--innerNeu);
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
		font-size: 1.2em;
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
		box-shadow: var(--submitHover);
		font-size: 1rem;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		padding: 5px 5px;
		color: var(--testo);
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
		background-color: var(--testo);
		
		color: var(--sfondo);
		border-radius: 0.2rem;
		padding: 0.2rem;
	}

</style>
