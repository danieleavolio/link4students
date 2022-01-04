<script lang="ts">
	import { authStore } from '$lib/stores/authStore';

	import EsamePriv from './EsamePriv.svelte';
	import EsamePub from './EsamePub.svelte';
	import ListaCollegamenti from './ListaCollegamenti.svelte';
	import NoExams from './NoExams.svelte';

	export let esamiSuperati;
	export let esamiCdl;
	export let mediaUtente;
	export let isVotiMostrati;
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
			{#if $authStore.isLoggedIn}
				{#if esame.data().uidUtente == $authStore.user.uid}
					<EsamePub {esame} />
				{:else if isVotiMostrati}
					<EsamePub {esame} />
				{:else}
					<EsamePriv nome={esame.data().nomeCorso} uidCorso={esame.data().uidCorso} />
				{/if}
			{/if}
		{/each}
	{:else}
		<NoExams />
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
</style>
