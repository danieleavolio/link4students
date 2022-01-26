<script context="module">
	export async function load({}) {
		const queryCorsi = query(collection(db, 'corsidilaurea'));

		let corsi = [];
		await getDocs(queryCorsi).then((res) => {
			res.docs.forEach((doc2) => {
				corsi = [...corsi, doc2];
			});
		});

		return {
			props: { corsi }
		};
	}
</script>

<script lang="ts">
	import {
		createUserWithEmailAndPassword,
		sendEmailVerification,
		signInWithEmailAndPassword,
		signOut
	} from 'firebase/auth';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { avatars } from '$lib/stores/defaultPictures';
	import { collection, doc, getDocs, increment, query, setDoc, where } from 'firebase/firestore';
	import { authStore } from '$lib/stores/authStore';
	import { auth, db } from '$lib/firebaseConfig';

	// FALSE --> MOSTRA FORM REGISTRAZIONE
	// TRUE --> MOSTRA FORM LOGIN
	let isRegisterChosen: boolean = true;

	export let corsi;

	let email: string;
	let password: string;
	let message: string = '';

	// Campo per l'utente
	let nome: string;
	let cognome: string;
	let matricola: number;
	let corsoDiLaurea: number;
	let annoDiCorso: number;
	let sicurezza;

	const hasNumbers = () => {
		let exp = /[0-9]/;
		if (password.match(exp)) return 1;
		return 0;
	};

	const hasUpperCase = () => {
		let exp = /[A-Z]/;
		if (password.match(exp)) return 1;
		return 0;
	};

	const hasLowerCase = () => {
		let exp = /[a-z]/;
		if (password.match(exp)) return 1;
		return 0;
	};

	const hasLength = () => {
		if (password.length > 8) return 1;
		return 0;
	};

	const checkPassowrd = () => {
		let livello = hasLength() + hasLowerCase() + hasUpperCase() + hasNumbers();

		switch (livello) {
			case 1:
				sicurezza = 'facile';
				break;
			case 2:
				sicurezza = 'media';
				break;
			case 3:
				sicurezza = 'efficace';
				break;
			case 4:
				sicurezza = 'difficile';
				break;
			default:
				break;
		}
	};

	$: if (password) {
		checkPassowrd();
	}

	$: if ($authStore.isLoggedIn) {
		if ($authStore.user.emailVerified) {
			goto('/');
		} else {
			auth.signOut();
			alert('Email non verificata');
		}
	}
	const randomAvatar = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};

	const handleAccountCreation = async () => {
		let exp = /@studenti.unical.it$/i;

		// Se la REGEX rispostta @studenti.unical.it
		if (email.match(exp)) {
			createUserWithEmailAndPassword(auth, email, password)
				.then(async () => {
					// Crea l'account nel database con i dati che servono a noi.
					// merge:true --> se l'account esiste, non sovrascrive
					// Genera un numero casuale tra 0 e 6 per prendere un avatar random

					// Devo prendermi il nome del corso per inserirlo nel profilo utente
					let corso = corsi.find((element) => element.id == `${corsoDiLaurea}`);
					let nomeCorsoLaurea = corso.data().nome;

					await setDoc(
						doc(db, 'users', auth.currentUser.uid),
						{
							nome: nome,
							cognome: cognome,
							matricola: matricola,
							corsoDiLaurea: corsoDiLaurea,
							nomeCorsoLaurea: nomeCorsoLaurea,
							annoDiCorso: annoDiCorso,
							uid: auth.currentUser.uid,
							avatar: $avatars[randomAvatar(0, 6)],
							preferenzaLibretto: 'tutti'
							// Sopra viene generato un numero da 0 a 6 che equivale al link di un immagine su storage
						},
						{ merge: true }
					).then(async () => {
						// Manda la mail di verifica per evitare account non istituzionali
						await sendEmailVerification(auth.currentUser);
						// Fai uscire perchè firebase fa subito il login
						signOut(auth);
						setDoc(
							doc(db, 'statistiche', 'infoSito'),
							{
								numUtenti: increment(1)
							},
							{ merge: true }
						);
					});
				})
				.catch((error) => {
					message = error.message;
				});
			//Manda la mail di verifica e fai il logout!

			message = 'Email di verifica inviata. Controlla la posta 📩';
		} else {
			message = 'Controlla i campi ⚠️';
		}
	};

	const handleLogin = async () => {
		await signInWithEmailAndPassword(auth, email, password)
			.then(() => {
				if ($authStore.isLoggedIn) {
					if ($authStore.user.emailVerified == false) {
						signOut(auth);
						message = 'Email non verificata';
					} else {
						goto('/');
					}
				}
			})
			.catch((error) => {
				message = error.message;
			});
	};
</script>

<svelte:head>
	<title>Unisciti a noi!</title>
</svelte:head>
<main>
	{#if !$authStore.isLoggedIn}
		<div class="box-scelta">
			<button class="registrati" on:click={() => (isRegisterChosen = true)}>Registrati</button>
			<button class="accedi" on:click={() => (isRegisterChosen = false)}>Accedi</button>
		</div>
		{#if isRegisterChosen}
			<h1>Crea il tuo account!</h1>
			<form on:submit|preventDefault={handleAccountCreation} action="">
				<div class="inputs">
					<label class="campo" for="nome"
						>Nome

						<input type="text" bind:value={nome} id="nome" />
					</label>
					<label class="campo" for="cognome"
						>Cognome

						<input type="text" bind:value={cognome} id="cognome" />
					</label>

					<p class="campo">
						Email
						<input
							bind:value={email}
							type="email"
							placeholder="Inserisci la tua email istituzionale.."
							required
						/>
					</p>

					<p class="campo">
						Password
						<input
							bind:value={password}
							type="password"
							placeholder="Inserisci una password di minimo 6 caratteri"
							minlength="6"
							required
						/>
						{#if password}
							<div class={sicurezza} />
						{/if}
					</p>
					<label class="campo" for="matricola"
						>Matricola
						<input type="number" bind:value={matricola} id="matricola" />
					</label>
					<label class="campo" for="corsodilaurea"
						>Corso di Laurea
						<select bind:value={corsoDiLaurea} name="corsodilaurea" id="corsodilaurea">
							{#each corsi as corso}
								<option value={corso.id}>{corso.data().nome}</option>
							{/each}
						</select>
					</label>

					<label class="campo" for="annodicorso"
						>Anno di Corso
						<select bind:value={annoDiCorso} name="annodicorso" id="annodicorso">
							<option
								value="
					1">1</option
							>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="Fuori Corso">Fuori corso</option>
						</select>
					</label>
				</div>

				<button class="registrati" type="submit">Registrati</button>
			</form>
		{:else}
			<form on:submit|preventDefault={handleLogin} action="">
				<h1>Effettua l'accesso!</h1>
				<div class="inputs">
					<p>Email istituzionale</p>
					<input
						bind:value={email}
						type="email"
						placeholder="Inserisci la tua email istituzionale.."
						required
						autocomplete="on"
					/>
					<p>Password</p>
					<input
						bind:value={password}
						type="password"
						placeholder="Inserisci una password di minimo 6 caratteri"
						minlength="6"
						required
					/>
				</div>

				<button class="accedi" type="submit">Accedi</button>
			</form>
			<a class="resend" href="/reg/resend">Non hai ricevuto la mail? Clicca qui!</a>
			<a class="reset" href="/reg/resetpassword">Password Dimenticata?</a>
		{/if}
	{:else}
		<p>Hai già effettuato l'accesso!</p>
		<button class="torna-home" on:click={() => goto('/')}>Torna alla home</button>
	{/if}

	{#if message.length > 0}
		<p class="message" transition:fade>{message}</p>
	{/if}
</main>

<style>
	h1 {
		text-align: center;
	}
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 30px;
		box-shadow: var(--innerNeu);
		width: 80%;
		margin: auto;
		border-radius: 10px;
	}

	.box-scelta {
		display: flex;
		gap: 1rem;
		margin: 1rem;
	}

	form {
		display: grid;
		grid-template-columns: 1fr;
		place-items: center;
		gap: 1rem;
		font-size: 1.3rem;
		width: 100%;
	}

	.inputs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		width: 80%;

		gap: 1rem;
		font-size: 1.3rem;
	}
	input {
		width: 100%;
		outline: none;
		font-size: 1.1rem;
		height: 2em;
	}

	button {
		border-radius: 10px;
		cursor: pointer;
		padding: 0.5rem;
		max-width: 100px;
		width: 100%;
	}

	.accedi {
		color: var(--submit);
		align-self: center;
	}

	.accedi:hover {
		box-shadow: var(--submitHover);
		color: var(--sfondo);
		background-color: var(--submit);
	}

	.registrati {
		align-self: center;
	}

	.message {
		padding: 1rem;
		margin: 1rem;
		box-shadow: var(--innerNeu);
		border-radius: 0.5rem;
		color: var(--sfondo);
		box-shadow: var(--alertHover);
		background-color: var(--alert);
	}

	.torna-home {
		font-size: 1.3rem;
		box-shadow: var(--neumorphism);
		padding: 1rem;
		border-radius: 0.5rem;
		border: none;
		color: var(--testo);
		background-color: var(--sfondo);
		max-width: 200px;
	}
	select {
		border-radius: 0.5rem;
		box-shadow: var(--neumorphism);
		font-size: 1.1rem;
		outline: none;
		border: var(--bordo);
		width: 100%;
	}

	.resend,
	.reset {
		margin: 1rem;
		color: var(--submit);
		text-decoration: none;
		transition: all 0.4s cubic-bezier(0.445, 0.05, 0.55, 0.95);
	}
	.resend:hover,
	.reset:hover {
		transform: scale(1.1);
	}

	input:-webkit-autofill {
		-webkit-text-fill-color: var(--testo);
		-webkit-box-shadow: var(--neumorphism);
		box-shadow: 0 0 0 1000px var(--sfondo) inset;
	}

	.campo {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.facile {
		width: 20%;
		height: 5px;
		background-color: var(--alert);
	}

	.media {
		width: 50%;
		height: 5px;

		background-color: var(--resolve);
	}

	.efficace {
		width: 80%;
		height: 5px;
		background-color: rgb(72, 248, 72);
	}

	.difficile {
		width: 100%;
		height: 5px;
		background-color: var(--submit);
	}

	.tipo {
		font-size: 0.8em;
	}

	@media screen and (max-width: 900px) {
		.inputs {
			grid-template-columns: 1fr;
			text-align: center;
		}
	}

	@media screen and (max-width: 350px) {
		.inputs {
			grid-template-columns: 1fr;
			text-align: center;
		}
		input {
			font-size: 0.6em !important;
		}
	}
</style>
