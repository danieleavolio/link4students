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
		<p class="scheda non-disponibile">Scheda Insegnamento<br /> Non disponbiile</p>
	{:else}
		<a class="scheda disponibile" target="_blank" href={linkScheda}> 📃 {nomeLinkScheda}</a>
	{/if}
	<p>Ore di insegnamento totali: {oreCorso}</p>
</div>

<style>
	.scheda {
		text-decoration: none;
		font-size: 1rem;
		background-color: black;
		color: white;
		border-radius: 0.2rem;
		padding: 0.2rem;
		cursor: pointer;
		width: fit-content;
	}
	.non-disponibile {
		background-color: #00000054;
		cursor: not-allowed;
	}

	.disponibile {
		display: block;
		margin: 1rem 0;
	}
</style>
