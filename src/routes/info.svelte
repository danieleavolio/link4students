<script>
</script>

<svelte:head>
	<title>Informazioni</title>
</svelte:head>

<h1>Informazioni</h1>
<div class="container">
	<div class="blocco">
		<p class="domanda">Per quale motivo esiste questo sito?</p>
		<p class="risposta">
			La motivazione che ha portato alla creazione di questo sito è per creare dei collegamenti tra
			gli studenti, dando la possibilità di dare pareri e scambiarsi domande e incertezze per i
			corsi dei propri corsi di laurea.
		</p>
	</div>

	<div class="blocco">
		<p class="domanda">Quali tecnologie sono state utilizzate?</p>
		<p class="risposta">
			Le tecnologie usate per realizzare questo applicativo web sono le seguenti:
		</p>
		<div class="links">
			<a target="_blank" href="https://kit.svelte.dev/">SvelteKit</a>
			<a target="_blank" href="https://firebase.google.com/">Firebase</a>
			<a target="_blank" href="https://nodejs.org/it/">Node.js</a>
		</div>
		<p>
			L'utilizzo di tali tecnologie ha permesso uno sviluppo rapido e semplice, viste le API di
			Firebase e i metodi forniti da SvelteKit per gestire l'interfaccia grafica e gli eventi.
		</p>
	</div>

	<div class="blocco">
		<p class="domanda">Chi ha lavorato al progetto?</p>
		<p class="rispota">
			Lo sviluppatore del sito sono io, <a href="https://www.danieleavolio.it" target="_blank"
				>Daniele Avolio</a
			>; sono uno studente di
			<a href="https://informatica.unical.it/" target="_blank">Informatica</a>
			all'<a target="_blank" href="https://www.unical.it/portale/">Università della Calabria.</a>
			Ho creato questo progetto sotto la guida del mio relatore di Tesi:
			<a href="https://www.alviano.net/" target="_blank">Mario Alviano</a>.
		</p>
	</div>

	<div class="blocco">
		<p class="domanda">Sono state utilizzate delle API per gestire i dati?</p>
		<p class="risposta">
			No. Tutti i dati all'interno del sito sono stati aggiunti e gestiti dall'utente amministratore
			che ha la possibilità di gestire tutti i contenuti del sito. Ogni corso, recensione, domanda,
			appunto e utente può essere eliminato dall'amministratore, anche imponendo periodi di
			sospensione agli utenti che non seguono le regole.
		</p>
	</div>

	<div class="blocco">
		<p class="domanda">Quali sono le regole?</p>

		<p class="risposta">Le regole sono le seguenti:</p>
		<ol>
			<li>Non utilizzare un linguaggio aggressivo interagendo con gli altri utenti.</li>
			<li>Non utilizzare esclamazioni blasfeme all'interno del sito.</li>
			<li>
				Non caricare contenuti sotto copyright nella sezione appunti di ogni corso. Pena: la
				sospensione per 3 giorni.
			</li>
			<li>
				Non utilizzare avatar / immagini del profilo che sono NSFW.
			</li>
		</ol>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		box-shadow: var(--neumorphism);
		width: 80vw;
		padding: 1rem;
		border-radius: 1rem;
		white-space: normal;
		margin: 1rem 0 4rem 0;
	}

	.blocco {
		box-shadow: var(--innerNeu);
		padding: 0 1rem;
		border-radius: 0.5rem;
	}
	.domanda::before {
		content: 'D: ';
	}

	.domanda {
		font-weight: 800;
		font-size: 1.1rem;
	}

	.risposta::before {
		content: 'R: ';
	}

	.links {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 0 1rem;
	}

	a {
		font-weight: 600;
		color: var(--testo);
		transition: var(--velocita);
		padding: 0.2rem;
		border-radius: 0.5rem;
	}

	a:hover {
		box-shadow: var(--innerNeu);
	}
</style>
