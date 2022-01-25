<script>
	import { auth } from '$lib/firebaseConfig';

	import { sendPasswordResetEmail } from 'firebase/auth';

	let email = '';
	let message = '';
	let errorMessage = '';
	const resetta = () => {
		let exp = /@studenti.unical.it$/i;

		if (email.match(exp)) {
			sendPasswordResetEmail(auth, email)
				.then(() => {
					message = 'Controlla la tua posta per resettare la password';
				})
				.catch((error) => {
					errorMessage = error.message;
				});
		}
	};
</script>
<svelte:head>
	<title>Resetta password</title>
</svelte:head>
<h2>Resetta la tua password</h2>

<form action="" on:submit|preventDefault={resetta}>
	{#if message.length > 0}
		<p class="message">{message}</p>
	{:else}
		<label for="email">La tua email</label>
		<input bind:value={email} id="email" type="email" />
		<button class="reset">Resetta</button>
	{/if}
	{#if errorMessage.length > 0}
		<p class="error-message">{errorMessage}</p>
	{/if}
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1em;
		font-size: 1.3em;
		width: 80%;
		box-shadow: var(--innerNeu);
		border-radius: 0.8em;
		padding: 1em;
		justify-content: center;
		align-items: center;
	}
	.reset {
		box-shadow: var(--submitHover);
		background-color: var(--submit);
		color: var(--sfondo);
		border-radius: 0.3em;
		font-size: 1.1em;
		cursor: pointer;
		width: fit-content;
		align-self: center;
	}

	input {
		font-size: 1.1em !important;
		width: 80%;
	}

	.message,
	.error-message {
		font-size: 1em;
		padding: 0.2em;
		border-radius: 0.3em;
		color: var(--sfondo);
		width: fit-content;
		align-self: center;
		box-shadow: var(--neumorphism);
	}

	.message {
		background-color: var(--submit);
	}

	.error-message {
		background-color: var(--alert);
	}
</style>
