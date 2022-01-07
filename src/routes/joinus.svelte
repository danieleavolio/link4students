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
							avatar: $avatars[randomAvatar(0, 6)]
							// Sopra viene generato un numero da 0 a 6 che equivale al link di un immagine su storage
						},
						{ merge: true }
					).then(() => {
						setDoc(
							doc(db, 'statistiche', 'infoSito'),
							{
								numUtenti: increment(1)
							},
							{ merge: true }
						);
					});
					// Manda la mail di verifica per evitare account non istituzionali
					await sendEmailVerification(auth.currentUser);
					// Fai uscire perchè firebase fa subito il login
					signOut(auth);
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
					console.log('entrato')
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

<main>
	{#if !$authStore.isLoggedIn}
		<div class="box-scelta">
			<button class="registrati" on:click={() => (isRegisterChosen = true)}>Registrati</button>
			<button class="accedi" on:click={() => (isRegisterChosen = false)}>Accedi</button>
		</div>
		{#if isRegisterChosen}
			<form on:submit|preventDefault={handleAccountCreation} action="">
				<h1>Crea il tuo account!</h1>
				<p>Email</p>
				<input
					bind:value={email}
					type="email"
					placeholder="Inserisci la tua email istituzionale.."
					required
				/>
				<p>Password</p>
				<input
					bind:value={password}
					type="password"
					placeholder="Inserisci una password di minimo 6 caratteri"
					minlength="6"
					required
				/>
				<label for="nome">Nome</label>
				<input type="text" bind:value={nome} id="nome" />
				<label for="cognome">Cognome</label>
				<input type="text" bind:value={cognome} id="cognome" />
				<label for="matricola">Matricola</label>
				<input type="number" bind:value={matricola} id="matricola" />
				<label for="corsodilaurea">Corso di Laurea</label>
				<select bind:value={corsoDiLaurea} name="corsodilaurea" id="corsodilaurea">
					{#each corsi as corso}
						<option value={corso.id}>{corso.data().nome}</option>
					{/each}
				</select>
				<label for="annodicorso">Anno di Corso</label>
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
				<button class="registrati" type="submit">Registrati</button>
			</form>
		{:else}
			<form on:submit|preventDefault={handleLogin} action="">
				<h1>Effettua l'accesso!</h1>
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
				<button class="accedi" type="submit">Accedi</button>
			</form>
		{/if}
	{:else}
		<p>Hai già effettuato l'accesso!</p>
		<button class="torna-home" on:click={()=> goto('/')}>Torna alla home</button>
	{/if}

	<p class="message" transition:fade>{message}</p>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 30px;
		background-color: #bdd8e7;
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
		display: flex;
		flex-direction: column;
		width: 80%;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
	form > input {
		width: 80%;
		border: none;
		border-bottom: #c300ff solid;
		outline: none;
		font-size: 1.1rem;
	}

	button {
		border-radius: 10px;
		border: none;
		background-color: white;
		cursor: pointer;
		padding: 0.5rem;
		max-width: 100px;
		width: 100%;
		color: white;
	}

	.accedi {
		background-color: black;
		align-self: center;
	}

	.registrati {
		background-color: white;
		border: black solid;
		color: black;
		align-self: center;
	}

	.message {
		background-color: #c300ff;
	}

	.torna-home{
		font-size: 1.3rem;
		box-shadow: var(--neumorphism);
		padding: 1rem;
		border-radius: 0.5rem;
		border:none;
		color:var(--testo);
		background-color: var(--sfondo);
		max-width: 200px;
	}
</style>
