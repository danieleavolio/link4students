<script>
	import { fly } from 'svelte/transition';
</script>

<div in:fly={{ y: 100 , duration:1000}} out:fly class="vuoto">
	<div class="emoji">
		<p><span class="material-icons">
            search_off
            </span></p>
	</div>
	<div class="testo">
		<p>Nessun risultato..</p>
	</div>
</div>

<style>
	.vuoto {
		display: flex;
		gap: 1rem;
		font-size: 2rem;
		border-radius: 0.4rem;
		padding: 0.5rem;
		margin: 1rem;
		justify-content: center;
		align-items: center;
	}

	 p  > span{
		font-size: 2.4rem;
	}
</style>
