<script lang="ts">
	import Footer from '$lib/components/utilities/Footer.svelte';
import Nav from '$lib/components/utilities/Nav.svelte';
	import '../app.css';
</script>

<main>
	<Nav />

	<div class="main-container">
		<slot />
	</div>
</main>

<Footer></Footer>

<style>
	.main-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		justify-self: center;
		margin: 2rem 0;
		font-weight: 500;
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
		--collegati: rgb(111, 4, 161);
		--submit: rgb(45, 76, 200);
		--resolve: rgb(72, 204, 36);
		--submitHover: 0 0 0 rgba(0, 0, 0, 0.2), 0 0 0 rgba(219, 255, 255, 0.5),
			inset 15px 15px 10px #2641aa, inset -15px -15px 10px #7792ff;
		--alertHover: 0 0 0 rgba(0, 0, 0, 0.2), 0 0 0 rgba(219, 255, 255, 0.5),
			inset 15px 15px 15px #c44b4b, inset -15px -15px 15px #f07272;
		--resolveHover: 0 0 0 rgba(0, 0, 0, 0.2), 0 0 0 rgba(219, 255, 255, 0.5),
			inset 15px 15px 15px #3dad1f, inset -15px -15px 15px #91f775;
	}


</style>
