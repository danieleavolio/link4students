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
		<a class="scheda disponibile" target="_blank" href={linkScheda}>
			<span class="material-icons"> description </span> {nomeLinkScheda}</a
		>
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
		opacity: 100%;
		box-shadow: var(--neumorphism);
		font-size: 1.2em;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5em;
	}

	@media screen and (max-width: 700px){
		.container{
			text-align: center;
			grid-template-columns: 1fr;
			place-items: center;
		}

		.scheda{
			margin: auto;
		}
	}
</style>
