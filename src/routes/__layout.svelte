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
	}

	:global(:root) {
    --neumorphism: 5px 10px 10px rgba(0, 0, 0, 0.2), -5px -10px 10px rgba(219, 255, 255, 0.5);
}
</style>
