<script>
	export let oggetti;
	import { fly, fade } from 'svelte/transition';
</script>

<div in:fly={{ y: 100, duration: 1000 }} out:fade class="box">
	<p class="emoji">☁️</p>
	<p class="contenuto">Non ci sono <span>{oggetti}</span> da controllare</p>
</div>

<style>
	.box {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		box-shadow: var(--innerNeu);
		padding: 0.5rem;
		border-radius: 10px;
	}

	.emoji {
		font-size: 4rem;
		margin: 0;
		font-weight: 600;
	}

	.contenuto {
		font-size: 2.2rem;
		margin: 0;
	}

    span{
        font-weight: 600;
    }
</style>
