<script lang="ts">
	import { goto } from '$app/navigation';
	import ContainerSocial from '$lib/components/profilo/ContainerSocial.svelte';
	import Loading from '$lib/components/utilities/Loading.svelte';

	import { auth, db, storage } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';
	import {
		EmailAuthProvider,
		onAuthStateChanged,
		reauthenticateWithCredential,
		updatePassword
	} from 'firebase/auth';

	import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
	let user;

	let pswField = '';
	let pswFieldConfirm = '';
	let oldPsw = '';
	let area;
	let bio;
	let preferenza;
	let errorMessage = '';
	let message = '';
	let loading = false;
	let contenutoBio;
	let file;
	let annocorso;

	let avatar;

	let profilePicture;

	$: if (pswField.length || oldPsw.length || pswFieldConfirm) {
		errorMessage = '';
		message = '';
	}

	const aggiornaDati = async () => {
		loading = true;
		await pulisciBio();
		let data = {
			bio: bio,
			preferenzaLibretto: preferenza,
			annoDiCorso: annocorso,
			socials
		};

		if (file != null) await cambiaFoto();

		await setDoc(doc(db, 'users', $authStore.user.uid), data, { merge: true });
		await aggiornaPassword();
		loading = false;
		location.reload();
	};

	const aggiornaPassword = async () => {
		if (pswField == pswFieldConfirm && pswField.length > 6) {
			let credentials = EmailAuthProvider.credential($authStore.user.email, oldPsw);
			reauthenticateWithCredential($authStore.user, credentials)
				.then(async () => {
					await updatePassword($authStore.user, pswField)
						.then(() => {
							loading = false;
							message = 'Dati modificati con successo';
						})
						.catch((error) => {
							loading = false;
							errorMessage = error.message;
						});
				})
				.catch((error) => {
					loading = false;
					errorMessage = error.message;
				});
		}
	};

	const pulisciBio = async () => {
		bio = area.value.trim();
	};

	const onChange = () => {
		// Quando scelgo l'immagine viene assegnato a questo file
		file = profilePicture.files[0];
		avatar.src = URL.createObjectURL(file);
	};

	const cambiaFoto = async () => {
		if (file) {
			let picturesRef = ref(storage, `profilePictures/avatar${user.data().uid}`);
			// Carico l'immagine del profilo nel database
			await uploadBytes(picturesRef, file).then(async () => {
				// Prendo l'url dell'immagine appena caricata
				await getDownloadURL(picturesRef).then(async (url) => {
					// Aggiorno l'immagine del profilo dell'utente con il link di quello caricato
					console.log('dioca');

					await setDoc(
						doc(db, 'users', $authStore.user.uid),
						{
							avatar: url
						},
						{ merge: true }
					);
				});
			});
		} else {
			alert('Errore caricamento immagine');
		}
	};

	let socials = [
		{ social: 'twitter', url: 'https://twitter.com/', username: '' },
		{ social: 'linkedin', url: 'https://www.linkedin.com/in/', username: '' },
		{ social: 'instagram', url: 'https://www.instagram.com/', username: '' },
		{ social: 'github', url: 'https://github.com/', username: '' }
	];

	onAuthStateChanged(auth, async (usr) => {
		if (usr) {
			await getDoc(doc(db, 'users', usr.uid)).then((usr) => {
				user = usr;
			});
			preferenza = user.data().preferenzaLibretto;
			contenutoBio = user.data().bio != null ? user.data().bio : 'Nessuna bio.';
			annocorso = user.data().annoDiCorso != null ? user.data().annoDiCorso : '1';
		}
	});
</script>

<h1>Modifica dati</h1>
<p>In questa pagina puoi modificare le informazioni del tuo profilo e la tua password.</p>
{#if $authStore.isLoggedIn && user != null}
	<div class="container">
		<div class="avatar-nome">
			<div class="avatar">
				<div class="backdrop" on:click={() => profilePicture.click()}>
					<span class="material-icons"> image </span>
					<form action="">
						<input
							type="file"
							name="photo"
							id="avatar"
							bind:this={profilePicture}
							on:change={onChange}
							accept="images/pmg, images/jpg "
						/>
					</form>
				</div>
				<img bind:this={avatar} src={user.data().avatar} alt="" />
			</div>
		</div>

		<div class="dati">
			<label for="nome"
				>Nome
				<p class="dato-costante" id="nome">{user.data().nome}</p>
			</label>
			<label for="cognome"
				>Cognome

				<p class="dato-costante" id="cognome">{user.data().cognome}</p>
			</label>
			<label for="email"
				>Email

				<p class="dato-costante" id="email">{$authStore.user.email}</p>
			</label>
		</div>
		<div class="inputs-container">
			<form action="" on:submit|preventDefault={aggiornaDati}>
				<div class="inputs">
					<label class="griglia" for="anno-corso"
						>Anno di corso

						<select bind:value={annocorso} class="anno-corso" name="anno" id="anno-corso">
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="Fuori Corso">Fuori Corso</option>
						</select>
					</label>

					<label class="griglia" for="bio"
						>La tua bio

						<textarea
							bind:this={area}
							name="bio"
							id="bio"
							cols="30"
							rows="5"
							minlength="10"
							maxlength="125">{contenutoBio}</textarea
						>
					</label>
				</div>

				<div class="psw-field">
					<label for="oldPsw">
						Vecchia Password
						<input bind:value={oldPsw} type="password" id="oldPsw" minlength="4" />
					</label>
				</div>
				<div class="psw-field">
					<label for="psw"
						>Nuova Password

						<input bind:value={pswField} type="password" id="psw" minlength="6" />
					</label>
					<label for="psw-confirm"
						>Conferma Password
						<input bind:value={pswFieldConfirm} type="password" id="psw-confirm" minlength="6" />
					</label>
				</div>
				{#if pswField != null && pswFieldConfirm != null}
					{#if pswField != pswFieldConfirm && pswField.length > 0 && pswFieldConfirm.length > 0}
						<p class="check-credentials">Controlla le credenziali!</p>
					{/if}
				{/if}
				{#if errorMessage.length > 0}
					<p class="check-credentials">{errorMessage}</p>
				{/if}
				{#if message.length > 0}
					<p class="message">{message}</p>
				{/if}
				<p>Modifica preferenza libretto</p>

				<div class="preferenze-field">
					<button
						on:click={() => (preferenza = 'tutti')}
						type="button"
						class="preferenza {preferenza == 'tutti' ? 'attivo' : ''}"
						>TUTTI <span class="material-icons"> account_circle </span></button
					>
					<button
						on:click={() => (preferenza = 'connessi')}
						type="button"
						class="preferenza {preferenza == 'connessi' ? 'attivo' : ''}"
						>CONNESSI <span class="material-icons"> stream </span></button
					>
					<button
						on:click={() => (preferenza = 'nessuno')}
						type="button"
						class="preferenza {preferenza == 'nessuno' ? 'attivo' : ''}"
						>NESSUNO <span class="material-icons"> close </span></button
					>
				</div>

				<div class="social-fields">
					{#each socials as social}
						<ContainerSocial
							social={social.social}
							{user}
							bind:url={social.url}
							bind:username={social.username}
						/>
					{/each}
				</div>

				<div class="bottoni">
					<button class="save">Salva</button>
					{#if user != null}
						<button type="button" on:click={() => goto(`/profilo/${user.id}`)} class="annulla"
							>Chiudi</button
						>
					{/if}
				</div>
			</form>
		</div>
		{#if loading}
			<Loading />
		{/if}
	</div>
{:else}
	<Loading />
{/if}

<style>
	p {
		text-align: center;
	}
	.container {
		display: flex;
		flex-direction: column;
		padding: 1em;
		box-shadow: var(--neumorphism);
		border-radius: 0.4em;
		margin: 1em;
	}
	.avatar {
		width: 200px;
		height: 200px;
		border-radius: 50%;
		position: relative;
		margin: 3em;
	}

	.avatar > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
	}

	.avatar-nome {
		display: grid;
		grid-template-columns: 1fr;
		place-items: center;
	}

	.avatar:hover > .backdrop {
		opacity: 100%;
	}

	.backdrop {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.753);
		border-radius: 100%;
		opacity: 0%;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.social-fields {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1em;
		box-shadow: var(--neumorphism);
		padding: 1em;
		border-radius: 0.8em;
	}

	.material-icons {
		position: relative;
		font-size: 3em;
	}

	input[type='file'] {
		display: none;
	}
	.dati {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5em;
	}
	.dato-costante {
		border: var(--bordo);
		font-size: 1.2em;
		padding: 0.2em;
		border-radius: 0.3em;
		margin-left: -0.2em;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	label,
	p {
		font-size: 1.1em;
		margin: 1.2em;
	}

	#psw,
	#psw-confirm {
		font-size: 1.2em;
	}

	.psw-field {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1em;
	}
	.psw-field > label {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.save,
	.annulla {
		background-color: var(--submit);
		color: var(--sfondo);
		border-radius: 0.2em;
		width: fit-content;
		font-size: 1.5em;
		align-self: center;
		cursor: pointer;
	}

	.annulla {
		background-color: var(--sfondo);
		color: var(--testo);
	}

	.save:hover {
		box-shadow: var(--submitHover);
	}

	.check-credentials {
		color: var(--alert);
		text-align: center;
	}

	.griglia {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.inputs {
		display: grid;
		grid-template-columns: 1fr 2fr;
	}
	.anno-corso {
		width: fit-content;
		padding: 1rem;
		outline: none;
		border: var(--bordo);
		border-radius: 0.8em;
	}

	textarea {
		word-break: break-all;
	}

	.preferenze-field {
		display: flex;
		gap: 1em;
		justify-content: center;
		align-items: center;
	}
	.attivo {
		box-shadow: var(--submitHover);
		color: var(--sfondo);
		background-color: var(--submit);
	}

	.preferenza {
		font-size: 1.3em;
		border-radius: 0.4em;
		cursor: pointer;
		padding: 0.2em;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 50%;
	}

	.bottoni {
		display: flex;
		gap: 1em;
		justify-content: center;
		align-items: center;
	}

	.message {
		color: var(--sfondo);
		text-align: center;
		background-color: var(--submit);
		box-shadow: var(--submitHover);
		font-size: 1.5em;
		width: fit-content;
		align-self: center;
		border-radius: 0.2em;
		padding: 0.5em;
	}

	@media screen and (max-width: 850px) {
		.dato-costante {
			margin: 1em;
		}
		.avatar-nome {
			grid-template-columns: 1fr;
			margin: 1em;
		}

		.inputs {
			grid-template-columns: 1fr;
			place-items: center;
		}

		label {
			text-align: center;
		}

		.dati {
			grid-template-columns: 1fr;
		}

		.psw-field {
			grid-template-columns: 1fr;
		}
	}

	@media screen and (max-width: 500px) {
		.dato-costante {
			font-size: 0.8em;
		}
	}

	@media screen and (max-width: 600px) {
		.preferenze-field {
			flex-direction: column;
		}
	}
</style>
