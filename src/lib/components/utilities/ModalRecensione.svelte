<script>
	import { db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';

	import { addDoc, collection, doc, getDoc, serverTimestamp } from '@firebase/firestore';

	import SelectionForm from './SelectionForm.svelte';
	export let idCorso;

	let isOpen = false;

	let difficolta = 3;
	let utilita = 3;
	let contenuto;
	let anonimo = false;
	const open = () => {
		isOpen = true;
	};

	const close = () => {
		isOpen = false;
	};

	const mandaRecensione = () => {
		// Quando si invia una recensione, viene mandata su firebase
		getDoc(doc(db, 'users', $authStore.user.uid)).then((ref) => {
			let nome = ref.data().nome;
			const data = {
				nome: nome,
				idCorso: idCorso,
				idAutore: $authStore.user.uid,
				data: serverTimestamp(),
				contenuto: contenuto,
				votoDifficolta: difficolta,
				votoUtilita: utilita,
				anonimo:anonimo
			};
			addDoc(collection(db, 'recensioni'), data)
				.then(() => {
					alert('Recensione caricata!');
					close();
				})
				.catch((error) => {
					alert(error);
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
			<button class="close-button" on:click={close}> ❌ </button>
			<slot name="header">
				<div class="titolo">
					<p>Recensione per:</p>
				</div>
			</slot>

			<div class="contenuto">
				<slot name="content" />
				<div class="domande">
					<form action="" on:submit|preventDefault={mandaRecensione}>
						<div class="domanda">
							<p>Quanto reputi difficile l'esame? <span class="icona">🧠</span></p>
							<SelectionForm bind:difficolta icon={'🧠'} {utilita} />
						</div>

						<div class="domanda">
							<p>Quanto reputi utile l'esame? <span class="icona">🎓</span></p>
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
								required
								wrap="hard"
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
		box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2), 5px 5px 5px rgba(255, 255, 255, 0.5);
		border: none;
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
		border: none;
		outline: none;
		font-size: 1.2rem;
		border: black solid;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		cursor: pointer;
		position: fixed;
	}
	.titolo {
		font-size: 1.3rem;
		font-weight: 600;
		text-align: center;
	}
	.contenuto {
		max-height: 50vh;
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

	.icona {
		font-size: 1.4rem;
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
