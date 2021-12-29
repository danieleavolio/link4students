<script>
	import { goto } from '$app/navigation';

	export let segnalazione;
</script>

<div class="main-container">
	<button on:click={() => goto(`/profilo/${segnalazione.data().idSegnalatore}`)} class="segnalatore"
		> 🔗 SEGNALATORE</button
	>
	<div class="contenuto">
		<p>{segnalazione.data().contenutoSegnalazione}</p>
	</div>
</div>

<style>
	.segnalatore {
		font-weight: 600;
		border-radius: 8px;
		padding: 0.5rem;
		margin: 0.5rem 0;
        width: fit-content;
	}

	.main-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		white-space: normal;
		justify-content: center;
	}

	.contenuto {
		font-size: 1.1rem;
	}
</style>
