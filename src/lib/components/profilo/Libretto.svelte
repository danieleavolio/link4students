<script>
	import EsamePub from './EsamePub.svelte';

	export let esamiSuperati;
	export let esamiCdl;
	export let mediaUtente;
	export let loading;
</script>

<div class="statistiche">
	<p>Statistiche studente</p>
	{#if !loading}
		<p>Media: {mediaUtente}</p>
		<p>Esami superati: {esamiSuperati.length} / {esamiCdl.length}</p>
		<p>Collegamenti: TO-DO</p>
	{:else}
		<div class="loading" />
	{/if}
</div>
<div class="lista-esami">
	<p>Lista esami</p>
	{#if !loading}
		{#each esamiSuperati as esame (esame.id)}
			<EsamePub {esame} />
			<!-- <EsamePriv nome={esame.data().nomeCorso} uidCorso={esame.id} /> -->
		{/each}
	{:else}
		<div class="loading" />
	{/if}
</div>

<style>
	.statistiche {
		border-radius: 0.5rem;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
		text-align: center;
	}

	.lista-esami {
		border-radius: 0.5rem;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
		text-align: center;
	}
	.loading {
		border: white solid;
		border-top: black solid;
		border-radius: 50%;
		width: 100px;
		height: 100px;
		animation: loading 0.5s infinite;
		margin: auto;
	}
</style>
