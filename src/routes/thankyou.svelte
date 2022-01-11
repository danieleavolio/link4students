<script>
	import { goto } from '$app/navigation';

	let secondi = 10;

	$: if (secondi < 0) {
		goto('/');
	}

	setInterval(() => {
		secondi--;
	}, 1000);
</script>

<div class="grazie">
	<div class="card">
		<div class="immagine" />
		<div class="destra">
			<p class="titolo">Grazie mille!</p>
			<p class="messaggio">
				Abbiamo ricevuto la tua mail! Ti ringraziamo infinitamente per il tuo tempo e per il tuo
				messaggio! Tornerai alla home tra: <span>{secondi}</span> oppure clicca <a href="/">QUI</a>
			</p>
		</div>
	</div>
</div>

<style>
	.grazie {
		margin: auto;
		height: 90vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.card {
		margin: auto;
		display: flex;
		box-shadow: var(--neumorphism);
		margin: 1rem;
		justify-content: center;
		border-radius: 1rem;
		width: 1000px;
	}

	.immagine {
		background-image: url('images/grazie.png');
		background-size: cover;
		width: 300px;
		height: 300px;
		border-radius: 1rem 0 0 1rem;
		box-shadow: var(--innerNeu);
	}

	.destra {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		padding: 1rem;
	}

	.titolo {
		font-size: 2rem;
		font-weight: 600;
	}

    a{
        color: var(--sfondo);
        background-color: var(--testo);
        padding: 0.2rem 1rem;
        font-size: 1rem;
        border-radius: 0.5rem;
        text-decoration: none;
    }
</style>
