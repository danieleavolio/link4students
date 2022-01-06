<script>
	import { goto } from '$app/navigation';

	import SuggerimentoRicerca from './SuggerimentoRicerca.svelte';
	let ricerca = '';

	const gotoRicerca = (tipo) => {
		ricerca = ricerca.trim();
		goto(`/ricerca?keyword=${ricerca}&tipo=${tipo}`);
		ricerca = '';
	};
</script>

<div class="search">
	<form on:submit|preventDefault={() => gotoRicerca('utenti')} action="">
		<span>🔎</span><input bind:value={ricerca} type="text" required min="2" />
	</form>
	{#if ricerca.length >= 4}
		<SuggerimentoRicerca bind:ricerca {gotoRicerca} />
	{/if}
</div>

<style>
	.search {
		color: rgb(27, 27, 27);
		padding: 1rem;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
		padding: 0.5rem;
		border-radius: 0.5rem;
		text-decoration: none;
		outline: none;
		margin: 0 auto;
		width: 80%;
	}

	input {
		border: none;
		outline: none;
		box-shadow: var(--neumorphism);
		border-radius: 0.2rem;
		font-size: 1rem;
	}
</style>
