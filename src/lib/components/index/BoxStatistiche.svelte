<script context="module">
</script>

<script>
	import Statistica from './Statistica.svelte';

	export let statistiche;
</script>

<div class="container">
	<h1>Statistiche</h1>
	<div class="lista-statistiche">
		<Statistica nome={'Recensioni'} numero={statistiche.numRecensioni} />
		<Statistica nome={'Utenti'} numero={statistiche.numUtenti} />
		<Statistica nome={'Appunti'} numero={statistiche.numAppunti} />
	</div>
</div>

<style>
	.container {
		text-align: center;
		width: 80%;
		box-shadow: var(--neumorphism);
		margin: 1rem;
		padding: 1rem;
		border-radius: 1rem;
		display: flex;
		border: var(--bordo);
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	h1 {
		margin: 0;
	}
	.lista-statistiche {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}

	@media screen and (max-width:500px){
		.lista-statistiche{
			flex-direction: column;
		}
	}
	
</style>
