<script>
	import { db, storage } from '$lib/firebaseConfig';

	import { authStore } from '$lib/stores/authStore';
	import { collection, doc, getDoc, increment, setDoc } from 'firebase/firestore';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

	let isOpen = false;
	let contenuto = '';
	let titoloAppunti = '';

	let bottoneFile;
	let fileAppunti;

	let caricamento = false;
	let messaggio = '';

	export let corso;

	const onChange = () => {
		fileAppunti = bottoneFile.files[0];
	};

	const mandaAppunti = () => {
		if (fileAppunti) {
			console.log(corso);
			caricamento = true;
			// Faccio un file con il nome e l'id dello studente per non avere sovrascritture
			let appuntiRef = ref(storage, `appunti/${fileAppunti.name}${$authStore.user.uid}`);
			uploadBytes(appuntiRef, fileAppunti).then(() => {
				// Devo creare l'appunto
				getDoc(doc(db, 'users', $authStore.user.uid)).then((user) => {
					getDownloadURL(appuntiRef).then((url) => {
						let data = {
							idUtente: $authStore.user.uid,
							idCorso: corso.data().codiceCorso,
							corsoUid: corso.id,
							urlAppunti: url,
							avatar: user.data().avatar,
							nome: user.data().nome,
							titoloAppunti: titoloAppunti,
							contenuto: contenuto,
							revisionato: false,
							likes: 0,
							dislikes: 0
						};
						// Aumento il numero di appunti nel sito di 1
						setDoc(doc(collection(db, 'appunti')), data)
							.then(() => {
								messaggio = 'Appunti caricati!';
								caricamento = false;
								setDoc(
									doc(db, 'statistiche', 'infoSito'),
									{
										numAppunti: increment(1)
									},
									{
										merge: true
									}
								);
							})
							.catch((error) => {
								console.log(error.message);
							});
					});
				});
			});
		}
	};

	const open = () => {
		isOpen = true;
	};

	const close = () => {
		isOpen = false;
	};
</script>

{#if $authStore.isLoggedIn}
	<slot name="trigger" {open}>
		<button class="domanda-button" on:click={open}>Carica appunti</button>
	</slot>
{/if}

{#if isOpen}
	<div class="modal">
		<div class="backdrop" on:click={close} />
		<div class="content-wrapper">
			<button class="close-button" on:click={close}> ❌ </button>
			<slot name="header">
				<div class="titolo">
					<p>Invia i tuoi appunti</p>
				</div>
			</slot>
			{#if caricamento}
				<div class="loading-div" />
			{:else if messaggio == ''}
				<div class="contenuto">
					<slot name="content" />
					<div class="domande">
						<form action="" on:submit|preventDefault={mandaAppunti}>
							<div class="titolo-container">
								<label for="input-titolo">Dai un titolo ai tuoi appunti</label>
								<input type="text" id="input-titolo" bind:value={titoloAppunti} required />
							</div>
							<div class="domanda text-area">
								<label for="area-appunti">Descrivi il contenuto dei tuoi appunti</label>
								<textarea
									bind:value={contenuto}
									name="appunti"
									id="area-appunti"
									cols="30"
									rows="4"
									maxlength="200"
									required
									wrap="hard"
									placeholder="Appunti per la parte dello scheduling. Grafici utili per la parte di sociologia"
								/>
							</div>
							<div class="input-file">
								<label for="input-rar"
									>Carica solamente file PDF, ZIP o 7Zip <br /> Il resto verrà scartato.</label
								>
								<input
									required
									bind:this={bottoneFile}
									on:change={onChange}
									type="file"
									name=""
									id="input-rar"
									accept=".zip, .rar, .pdf, .7zip"
								/>
							</div>
							<div class="submit-box">
								<button type="submit"> Invia appunti </button>
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
		border-radius: 0.5rem;
		font-size: 1rem;
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
		border-radius: 0.5rem;
		background-color: var(--sfondo);
		box-shadow: var(--innerNeu);
		overflow: hidden;
		padding: 2rem;
		display: flex;
		flex-direction: column;
	}

	.close-button {
		outline: none;
		font-size: 1.2rem;
		border-radius: 50%;
		box-shadow: var(--innerNeu);
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
		border-radius: 10px;
		padding: 0.5rem;
		justify-content: left;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	textarea {
		resize: none;
		border: none;
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

	.input-file {
		font-family: 'Roboto', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
		display: flex;
		flex-direction: column;
		font-size: 1rem;
	}

	input[type='file']{
		font-size: 1rem;
		border: none;
		outline: none;
	}

	.loading-div {
		border: var(--sfondo) solid 10px;
		border-top: solid var(--testo) 10px;
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
		padding: 0;
		border-radius: 4px;
		font-weight: 700;
		font-size: 2rem;
		box-shadow: var(--innerNeu);
		padding: 1rem;
		border-radius: 0.4rem;
	}
</style>
