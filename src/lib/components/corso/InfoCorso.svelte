<script lang="ts">
	export let corso;

	// Gestione dinamica dei contenuti del singolo attributo
	let oreCorso = corso.data().oreInsegnamento != '' ? corso.data().oreInsegnamento : 'Non fornito';
	let linkScheda = corso.data().linkScheda != '' ? corso.data().linkScheda : 'Non disponibile';
	let nomeLinkScheda = linkScheda != 'Non disponibile' ? 'Link Scheda' : 'Non disponibile';
</script>

<div class="container">
	<p>CFU: {corso.data().cfu}</p>
	<p>Codice del corso: {corso.data().codiceCorso}</p>
	<p>Anno del corso: {corso.data().anno}</p>
	<p>Professore: {corso.data().professore}</p>
	{#if linkScheda == 'Non disponibile'}
		<p class="scheda non-disponibile">Scheda Insegnamento<br /> Non disponbile</p>
	{:else}
		<a class="scheda disponibile" target="_blank" href={linkScheda}> 📃 {nomeLinkScheda}</a>
	{/if}
	<p>Ore di insegnamento totali: {oreCorso}</p>
</div>

<style>
	.scheda {
		text-decoration: none;
		font-size: 1rem;
		color: var(--testo);
		border-radius: 0.2rem;
		cursor: pointer;
		width: fit-content;
		opacity: 50%;
		z-index: 0;
	}
	.non-disponibile {
		cursor: not-allowed;
	}

	.disponibile {
		display: block;
		margin: 1rem 0;
	}
</style>
