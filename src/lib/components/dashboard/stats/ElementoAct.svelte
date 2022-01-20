<script>
	import { fly } from 'svelte/transition';
	export let elemento;
	export let tipo;
	export let emoji;

	let show = false;
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
{#if tipo == 'appunti'}
	<p>{emoji} {elemento.data().nome} ha caricato degli appunti</p>
{:else if tipo == 'risposta'}
	<p>{emoji} {elemento.data().nomeRispondente} ha scritto una {tipo}</p>
{:else}
	<p>{emoji} {elemento.data().autore.nome} ha scritto una {tipo}</p>
{/if}
<div class="attivita">
	<p class="contenuto">{elemento.data().contenuto}</p>
</div>

<style>
	.attivita {
		box-shadow: var(--innerNeu);
		padding: 0.2rem;
		border-radius: 0.5rem;
		width: 50%;
		margin: 0 0.5rem;
		overflow-wrap: anywhere;
}
</style>
