<script lang="ts">
	import Nav from '$lib/components/utilities/Nav.svelte';
	import '../app.css';
</script>

<main>
	<Nav />

	<div class="main-container">
		<slot />
	</div>
</main>

<footer />

<style>
	.main-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		justify-self: center;
		margin: 2rem 0;
		font-weight: 400;
	}

	:global(:root) {
		--neumorphism: 5px 5px 10px rgb(197, 197, 197), -5px -5px 10px rgba(255, 255, 255),
			inset 0 0 0 rgba(0, 0, 0, 0.2), inset 0 0 0 rgba(219, 255, 255, 0.5);
		--sfondo: rgb(237, 237, 237);
		--alert: rgb(231, 88, 88);
		--testo: #31344b;
		--innerNeu: 0 0 0 rgba(0, 0, 0, 0.2), 0 0 0 rgba(219, 255, 255, 0.5),
			inset 5px 5px 10px rgb(196, 196, 196), inset -5px -5px 10px rgba(255, 255, 255);
		--velocita: 0.2s ease;
		--premuto: scale(0.98);
		--bordo: rgb(204, 204, 204) solid 2px;
		
	}
</style>
