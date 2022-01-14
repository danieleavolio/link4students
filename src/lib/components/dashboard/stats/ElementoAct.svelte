<script>
	import { fly } from 'svelte/transition';
	export let elemento;
	export let tipo;
	export let emoji;

	let show = false;

	const showAct = () => {
		show = true;
		console.log('lol');
	};

	const hideAct = () => {
		show = false;
	};
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
{#if  tipo == 'appunti'}
<p on:mouseover={showAct}  on:mouseout={hideAct}>{emoji} {elemento.data().nome} ha caricato degli appunti</p>
{:else if tipo == 'risposta'}
<p on:mouseover={showAct}  on:mouseout={hideAct}>{emoji} {elemento.data().nomeRispondente} ha scritto una {tipo}</p>
{:else}
<p on:mouseover={showAct}  on:mouseout={hideAct}>{emoji} {elemento.data().nome} ha scritto una {tipo}</p>

{/if}
{#if show}
	<div transition:fly={{ y: 50 }} class="attivita">
		<p class="contenuto">{elemento.data().contenuto}</p>
	</div>
{/if}

<style>
	.attivita {
        box-shadow: var(--neumorphism);
        padding: 1rem;
        border-radius: 0.5rem;
    }

</style>
