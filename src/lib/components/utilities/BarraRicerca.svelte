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
		<span class="material-icons"> search </span><input
			bind:value={ricerca}
			type="text"
			required
			min="2"
		/>
	</form>
	{#if ricerca.length >= 3}
		<SuggerimentoRicerca bind:ricerca {gotoRicerca} />
	{/if}
</div>

<style>
	.search {
		color: rgb(27, 27, 27);
		padding: 1rem;
		box-shadow: var(--neumorphism);
		padding: 0.5rem;
		border-radius: 0.5rem;
		text-decoration: none;
		outline: none;
		margin: 0 auto;
		width: 80%;
		transition: var(--velocita);
	}

	.search:hover {
		box-shadow: var(--innerNeu);
		transform: scale(1.1);
	}

	form {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}
	input {
		border: none;
		outline: none;
		border-radius: 0.2rem;
		font-size: 1rem;
		box-shadow: var(--innerNeu);
		background-color: var(--sfondo);
	}

	span {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--testo);
	}
</style>
