<script lang="ts">
	import Footer from '$lib/components/utilities/Footer.svelte';
	import Nav from '$lib/components/utilities/Nav.svelte';
	import { afterUpdate } from 'svelte';
	import '../app.css';

	let navOpen;

	afterUpdate(() => {
		if (navOpen && document) {
			document.body.style.overflowY = 'hidden';
		} else if (!navOpen && document) {
			document.body.style.overflowY = 'auto';
		}
	});
</script>

<main>
	<Nav bind:navOpen />
	<div class="main-container">
		<slot />
	</div>
</main>

<Footer />

<style>
	.main-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		justify-self: center;
		margin: 2rem 0;
		font-weight: 500;
		overflow-x: hidden;
	}

	

	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--neumorphism: 8px 8px 10px rgb(26, 26, 26), -8px -8px 10px rgb(36, 36, 36),
				inset 0 0 0 rgba(0, 0, 0, 0.2), inset 0 0 0 rgba(0, 0, 0, 0.5);
			--sfondo: rgb(32, 32, 32);
			--sfondoComposfondonent: linear-gradient(145deg, #131313, #101010);
			--alert: rgb(230, 68, 68);
			--testo: rgb(240, 240, 240);
			--innerNeu: 0 0 0 rgb(15, 15, 15), 0 0 0 rgba(22, 22, 22, 0.5),
				inset 8px 8px 10px rgb(26, 26, 26), inset -8px -8px 10px rgb(35, 35, 35);
			--velocita: 0.2s ease;
			--premuto: scale(0.98);
			--bordo: rgb(27, 27, 27) solid 2px;
			--submit: rgb(58, 97, 255);
			--resolve: rgb(248, 252, 32);
			--discreto: rgb(255, 241, 50);
			--ottimo: rgb(28, 255, 77);
			--buono: rgb(82, 37, 245);
			--submitHover: 0 0 0 rgba(0, 0, 0, 0.2), 0 0 0 rgba(0, 0, 0, 0.5),
				inset 15px 15px 10px rgb(58, 97, 255), inset -15px -15px 10px #3e5dd8;
			--alertHover: 0 0 0 rgba(0, 0, 0, 0.2), 0 0 0 rgba(0, 0, 0, 0.5),
				inset 15px 15px 15px rgb(218, 60, 60), inset -15px -15px 15px #db3535;
			--resolveHover: 0 0 0 rgba(0, 0, 0, 0.2), 0 0 0 rgba(0, 0, 0, 0.5),
				inset 15px 15px 15px rgb(242, 255, 58), inset -20px -20px 15px #d0ff00;
		}
	}
	@media (prefers-color-scheme: light) {
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
			--submit: rgb(58, 97, 255);
			--resolve: rgb(204, 33, 176);
			--discreto: rgb(255, 228, 75);
			--buono: rgb(76, 114, 238);
			--ottimo: rgb(106, 204, 131);
			--submitHover: 0 0 0 rgba(0, 0, 0, 0.2), 0 0 0 rgba(219, 255, 255, 0.5),
				inset 15px 15px 10px #2641aa, inset -15px -15px 10px #7792ff;
			--alertHover: 0 0 0 rgba(0, 0, 0, 0.2), 0 0 0 rgba(219, 255, 255, 0.5),
				inset 15px 15px 15px #c44b4b, inset -15px -15px 15px #f07272;
			--resolveHover: 0 0 0 rgba(0, 0, 0, 0.2), 0 0 0 rgba(219, 255, 255, 0.5),
				inset 15px 15px 15px rgb(204, 33, 176), inset -15px -15px 15px rgb(95, 14, 82);
		}
	}
</style>
