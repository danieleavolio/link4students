<script>
	import { fly } from 'svelte/transition';
	export let elemento;
	export let tipo;
	export let emoji;

	let show = false;
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
{#if tipo == 'appunti'}
	<p>
		<span class="material-icons">{emoji}</span>
		{elemento.data().nome} ha caricato degli appunti
	</p>
{:else if tipo == 'risposta'}
	<p>
		<span class="material-icons">{emoji}</span>
		{elemento.data().nomeRispondente} ha scritto una {tipo}
	</p>
{:else}
	<p>
		<span class="material-icons">{emoji}</span>
		{elemento.data().autore.nome} ha scritto una {tipo}
	</p>
{/if}
<div class="attivita">
	<p class="contenuto">{elemento.data().contenuto}</p>
</div>

<style>
	.attivita {
		box-shadow: var(--innerNeu);
		padding: 0.2rem;
		border-radius: 0.5rem;
		width: 80%;
		margin: 0 0.5rem;
		overflow-wrap: anywhere;
	}
	p{
		display: flex;
		justify-content: left;
		align-items: center;
		gap: 1em;
		margin: 1em;
	}
</style>
