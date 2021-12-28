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
				nome: nome,
				// salvo l'avatar per non fare le query successivamente
				avatar: avatar,
				idCorso: idCorso,
				idAutore: $authStore.user.uid,
				data: serverTimestamp(),
				titolo: titoloDomanda,
				contenuto: contenuto,
				anonimo: anonimo
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
					<p>Fai una domanda</p>
				</div>
			</slot>

			<div class="contenuto">
				<slot name="content" />
				<div class="domande">
					<form action="" on:submit|preventDefault={mandaDomanda}>
						<div class="titolo-container">
							<label for="inputdomanda">Titolo domanda</label>
							<input type="text" id="inputdomanda" bind:value={titoloDomanda} required />
						</div>
						<div class="domanda text-area">
							<label for="area-recensione">Inserisci la tua domanda</label>
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
		background-color: blue;
		border-radius: 6px;
		color: white;
		border: none;
		outline: none;
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

	.domanda {
		box-shadow: 0px 5px 3px 0px rgb(0 0 0 / 20%);
		border-radius: 10px;
		padding: 0.5rem;
		background: lightcyan;
		justify-content: left;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	textarea {
		resize: none;
		border: none;
		width: 100%;
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
