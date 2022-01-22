<script>
	import { goto } from '$app/navigation';

	export let corso;
	import { fly } from 'svelte/transition';
</script>

<div
	transition:fly={{ y: 100 }}
	class="corso-lista"
	on:click={() => goto(`/corsodilaurea/corso/${corso.id}`)}
>
	<div class="avatar">
		<p>{corso.data().nome[0]}</p>
	</div>
	<div class="nome">
		<p>{corso.data().nome}</p>
	</div>
</div>

<style>
	.corso-lista {
		width: 500px;
		height: 100px;
		border-radius: 0.5rem;
		padding: 1rem;
		font-size: 1.3em;
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 1rem;
		place-items: center;
		box-shadow: var(--neumorphism);
		margin: 1rem;
		cursor: pointer;
		transition: var(--velocita);
	}

	.corso-lista:hover {
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}

	.avatar {
		width: 100px;
		height: 100px;
		border-radius: 100%;
		display: grid;
		place-items: center;
		box-shadow: var(--innerNeu);
		font-size: 2rem;
		transition: var(--velocita);
	}

	.corso-lista:hover > .avatar {
		box-shadow: var(--neumorphism);
		transform: var(--premuto);
	}
</style>
