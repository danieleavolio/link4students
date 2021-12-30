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
		box-shadow: 2px 5px 5px rgba(0, 0, 0, 0.4), -2px -5px 5px rgba(129, 192, 230, 0.4);
		margin: 1rem;
		padding: 1rem;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	h1 {
		margin: 0;
	}
	.lista-statistiche {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	}
</style>
