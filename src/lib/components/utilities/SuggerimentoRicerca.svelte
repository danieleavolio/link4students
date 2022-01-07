<script>
	export let ricerca;
	export let gotoRicerca;
	import { fly } from 'svelte/transition';

	const handleRicerca = (tipo) => {
		gotoRicerca(tipo);
		ricerca = '';
	};
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div transition:fly={{ y: -200, duration: 400 }} class="suggerimento">
	<p on:click={() => handleRicerca('utenti')}>
		Cerca <span>{ricerca}</span> in Utenti <span>👤</span>
	</p>
	<p on:click={() => handleRicerca('corsi')}>
		Cerca <span>{ricerca}</span> in Corsi <span>🎓</span>
	</p>
	<p on:click={() => handleRicerca('appunti')}>
		Cerca <span>{ricerca}</span> in Appunti <span> ✒️</span>
	</p>
</div>

<style>
	.suggerimento {

		background-color: var(--sfondo);
		color: var(--testo);
		border-radius: 0.5rem;
		padding: 0.3rem;
		z-index: 30;
	}



	
	span {
		background-color: rgba(225, 0, 255, 0.329);
		padding: 0.1rem;
		border-radius: 0.3rem;
	}

	p {
		cursor: pointer;
		font-size: 1rem;
        box-shadow: var(--neumorphism);
        transition: var(--velocita);
        padding: 0.2rem;
        border-radius: 0.3rem;
	}

    p:hover{
        box-shadow: var(--innerNeu);
        scale: var(--premuto);
    }
</style>
