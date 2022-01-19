<script lang="ts">

	import EsamePub from './EsamePub.svelte';
	import ListaCollegamenti from './ListaCollegamenti.svelte';
	import NoExams from './NoExams.svelte';

	export let esamiSuperati;
	export let esamiCdl;
	export let mediaUtente;
	export let collegamentiUtente;
</script>

<div class="statistiche">
	<p>Statistiche studente</p>
	<p>Media: {mediaUtente}</p>
	<p>Esami superati: {esamiSuperati.length} / {esamiCdl.length}</p>
	<p>Collegamenti:</p>
	<ListaCollegamenti {collegamentiUtente} />
</div>
<div class="lista-esami">
	<p>Lista esami</p>
	{#if esamiSuperati.length > 0}
		{#each esamiSuperati as esame (esame.id)}
			<EsamePub {esame} />
		{/each}
	{:else}
		<NoExams />
	{/if}
</div>

<style>
	.statistiche {
		border-radius: 0.5rem;
		box-shadow: var(--innerNeu);
		text-align: center;
	}

	.lista-esami {
		border-radius: 0.5rem;
		box-shadow: var(--innerNeu);
		text-align: center;
	}
</style>
