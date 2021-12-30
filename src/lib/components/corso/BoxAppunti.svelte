<script>
	import ModalAppunti from '../utilities/ModalAppunti.svelte';
	import Vuoto from '../utilities/Vuoto.svelte';

	export let idCorso;

	let appunti = [];
</script>

<div class="container">
	<h1>Lista degli appunti</h1>
	<div class="utilities">
		<ModalAppunti {idCorso} />
	</div>
	{#if appunti.length == 0}
		<Vuoto oggetti={'appunti'} />
	{:else}
		<div class="lista-appunti">
			{#each appunti as appunto (appunto.id)}
				<!-- <Appunto {appunto} /> -->
			{/each}
		</div>
	{/if}
</div>

<style>
	h1 {
		text-align: center;
	}
	.container {
		margin-bottom: 2rem;
		max-width: 100vw;
		width: 80%;
	}

	.lista-appunti {
		display: flex;
		gap: 4rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.utilities {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}   
</style>
