<script>
import { goto } from '$app/navigation';

	import SuggerimentoRicerca from './SuggerimentoRicerca.svelte';
	let ricerca = '';
    //<a href="/dashboard/adminpage?uid={$authStore.user.uid}">Admin</a>

    const gotoRicerca = (tipo) => {
		ricerca = ricerca.trim();
        goto(`/ricerca?keyword=${ricerca}&tipo=${tipo}`);
		ricerca = '';
    }


</script>

<div class="search">
	<form on:submit|preventDefault={() => gotoRicerca('utenti')} action="">
		<span>🔎</span><input bind:value={ricerca} type="text" />
	</form>
	{#if ricerca.length >= 4}
		<SuggerimentoRicerca bind:ricerca {gotoRicerca} />
	{/if}
</div>

<style>
</style>
