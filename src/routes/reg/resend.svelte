<script>
	import Loading from '$lib/components/utilities/Loading.svelte';
	import { auth } from '$lib/firebaseConfig';

	import { sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';
	import { fade } from 'svelte/transition';

	let email = '';
	let password = '';
	$: veraMail = email + '@studenti.unical.it';
	let message = '';
	let errore = '';
	let inviando = false;

	const mandaEmail = async () => {
		inviando = true;
		await signInWithEmailAndPassword(auth, veraMail, password)
			.then((usr) => {
				sendEmailVerification(usr.user).then(async () => {
					await signOut(auth);
					inviando = false;
					message = 'Codice mandato!';
					errore = '';
				});
			})
			.catch((error) => {
				errore = error.message;
				message = '';
				inviando = false;
			});
	};
</script>

<svelte:head>
	<title>Rimanda email</title>
</svelte:head>
<h2>Rimanda codice di verifica</h2>
<form action="" on:submit|preventDefault={mandaEmail}>
	<input bind:value={email} type="text" placeholder="Inserisci il tuo codice fiscale.." />
	<input bind:value={password} type="password" placeholder="Inserisci la tua password" />
	<button>Richiedi codice</button>
	<p class="message" transition:fade>{message}</p>
	<p class="error" transition:fade>{errore}</p>
</form>
{#if inviando}
	<div class="loading">
		<Loading />
	</div>
{/if}

<style>
	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	input{
		font-size: 1.3em!important;
	}

	button {
		background-color: var(--submit);
		font-size: 1.2rem;
		color: var(--sfondo);
		border-radius: 0.5rem;
		cursor: pointer;
	}
	button:hover {
		box-shadow: var(--submitHover);
	}

	p {
		font-size: 1.3rem;
	}

	.message {
		color: var(--submit);
	}
	.error {
		color: var(--alert);
	}

	input:-webkit-autofill {
		-webkit-text-fill-color: var(--testo);
		-webkit-box-shadow: var(--neumorphism);
		box-shadow: 0 0 0 1000px var(--sfondo) inset;
	}
</style>
