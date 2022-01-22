<script>
	export let oggetti;
	import { fly, fade } from 'svelte/transition';
</script>

<div in:fly={{ y: 100, duration: 1000 }} out:fade class="box">
	<p class="emoji"><span class="material-icons"> inbox </span></p>
	<p class="contenuto">Non ci sono {oggetti}</p>
</div>

<style>
	.box {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		box-shadow: var(--innerNeu);
		padding: 2rem;
		border-radius: 10px;
		margin: 2rem;
	}

	.emoji {
		font-size: 4rem;
		margin: 0;
		font-weight: 600;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.material-icons{
		font-size: 1.5em;
	}

	.contenuto {
		font-size: 2.2rem;
		margin: 0;
	}
</style>
