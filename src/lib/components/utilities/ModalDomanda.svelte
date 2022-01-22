<script>
	import { db } from '$lib/firebaseConfig';

	import { authStore } from '$lib/stores/authStore';
	import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';

	let isOpen = false;
	let contenuto = '';
	let titoloDomanda = '';
	let anonimo = false;
	export let idCorso;

	const open = () => {
		isOpen = true;
	};

	const close = () => {
		isOpen = false;
	};

	const mandaDomanda = () => {
		// Quando si invia una recensione, viene mandata su firebase
		getDoc(doc(db, 'users', $authStore.user.uid)).then((ref) => {
			let nome = ref.data().nome;
			let avatar = ref.data().avatar;
			const data = {
				// salvo l'avatar per non fare le query successivamente
				idCorso: idCorso,
				data: serverTimestamp(),
				titolo: titoloDomanda,
				contenuto: contenuto,
				anonimo: anonimo,
				autore:{
					avatar,
					nome,
					idAutore: $authStore.user.uid
				}
			};
			addDoc(collection(db, 'domande'), data)
				.then(() => {
					alert('Domanda fatta!');
                    close();
				})
				.catch((error) => {
					alert(error.message);
				});
		});
	};
</script>

{#if $authStore.isLoggedIn}
	<slot name="trigger" {open}>
		<button class="domanda-button" on:click={open}>Fai una domanda</button>
	</slot>
{/if}

{#if isOpen}
	<div class="modal">
		<div class="backdrop" on:click={close} />
		<div class="content-wrapper">
			<button class="close-button" on:click={close}> ❌ </button>
			<slot name="header">
				<div class="titolo">
					<p>Scrivi la tua domanda</p>
				</div>
			</slot>

			<div class="contenuto">
				<slot name="content" />
				<div class="domande">
					<form action="" on:submit|preventDefault={mandaDomanda}>
						<div class="titolo-container">
							<label for="inputdomanda">Titolo</label>
							<input type="text" id="inputdomanda" bind:value={titoloDomanda} required />
						</div>
						<div class="domanda text-area">
							<textarea
								bind:value={contenuto}
								name="recensione"
								id="area-recensione"
								cols="30"
								rows="4"
								maxlength="500"
								required
								wrap="hard"
								placeholder="Consigli per superare l'esame? Come faccio a calcolare l'area di MT5Bis? A che chiude la mensa?"
							/>
						</div>
						<div class="submit-box">
							<button> Invia domanda </button>
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
	.domanda-button {
		display: flex;
		align-self: center;
		padding: 0.4rem;
		border-radius: 6px;
		color: var(--submit);
		outline: none;
		cursor: pointer;
		font-size: 1rem;
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
		background-color: var(--sfondo);
		box-shadow: var(--innerNeu);
		overflow: hidden;
		padding: 2rem;
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
		justify-content: left;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 1rem;
	}

	textarea {
		resize: none;
		font-size: 1rem;
		box-shadow: var(--innerNeu);
		padding: 1rem;
		border-radius: 0.5rem;
		outline: none;
		border: var(--bordo);
		color: var(--testo);
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
