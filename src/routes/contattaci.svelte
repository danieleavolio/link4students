<script>
	let email;
	let utente;

	let textarea = '';
	let superato = 'no';

	$: superato = textarea.length > 400 ? 'si' : 'no';
</script>

<h1>Contattaci</h1>
<div class="mex">
	<div class="icon">⭐</div>
	<p>
		Hai trovato qualche problema nel sito? Hai in mente qualcosa che possa rendere il sito migliore?
		Faccelo sapere mandando un messaggio tramite il form sottostante!
	</p>
</div>
<div class="container">
	<form action="https://formsubmit.co/link4studentsunical@gmail.com" method="POST">
		<label for="name">Il tuo nome:</label>
		<input bind:value={utente} type="text" name="name" required placeholder="Mario.." />
		<label for="email">La tua email:</label>
		<input bind:value={email} type="email" name="email" required placeholder="Indirizzo email.." />
		<input type="hidden" name="_subject" value="Nuovo messaggio da {email}" />
		<input type="hidden" name="_next" value="http://localhost:3000/thankyou" />
		<label for="message">Inserisci il messaggio:</label>
		<textarea
			bind:value={textarea}
			rows="5"
			type="text"
			required
			name="message"
			placeholder="Inserisci il tuo messaggio.."
		/>
		{#if textarea != null}
			<div class="limit {superato}">
				<span class="going">{textarea.length} / </span><span class="max">400</span>
			</div>
		{/if}
		<input type="hidden" name="_captcha" value="false" />
		<input
			type="hidden"
			name="_autoresponse"
			value="Abbiamo ricevuto il tuo messaggio! Grazie mille per aver usato il tuo tempo per migliorare Link4Students!"
		/>
		<button disabled={superato == 'si'} type="submit">Manda messaggio</button>
	</form>
</div>

<style>
	.container {
		border-radius: 1rem;
		box-shadow: var(--neumorphism);
		padding: 1rem;
		margin: 1rem;
		width: 50vw;
	}

	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1rem;
	}
	button {
		width: 50%;
		margin: auto;
		cursor: pointer;
		font-size: 1.2rem;
		border-radius: 0.4rem;
		color: var(--submit);
	}

	button:hover {
		box-shadow: var(--submitHover);
		background-color: var(--submit);
		color: var(--sfondo);
	}

	button:disabled {
		opacity: 50%;
		color: var(--testo);
	}

	button:disabled:hover {
		box-shadow: var(--neumorphism);
		background-color: var(--sfondo);
		color: var(--testo);
	}

	.mex {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		width: 50%;
		word-break: keep-all;
		padding: 1rem;
		box-shadow: var(--neumorphism);
		border-radius: 0.5rem;
		font-size: 1.2rem;
	}

	.icon {
		font-size: 3rem;
		font-weight: 600;
		box-shadow: var(--innerNeu);
		border-radius: 0.4rem;
	}

	.no {
		color: var(--testo);
	}

	.si {
		color: var(--alert);
	}
</style>
