<script>
	export let ricerca;
	export let gotoRicerca;
	export let handleOpen;
	import { fly } from 'svelte/transition';

	const handleRicerca = (tipo) => {
		gotoRicerca(tipo);
		handleOpen();
	};
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div transition:fly={{ y: -200, duration: 400 }} class="suggerimento" on:click={handleOpen}>
	<p on:click={() => handleRicerca('utenti')}>
		Cerca <span>{ricerca}</span> in Utenti <span class="material-icons">
			account_circle
			</span>
	</p>
	<p on:click={() => handleRicerca('corsi')}>
		Cerca <span>{ricerca}</span> in Corsi <span class="material-icons">
			school
			</span>
	</p>
	<p on:click={() => handleRicerca('appunti')}>
		Cerca <span>{ricerca}</span> in Appunti <span class="material-icons">
			edit
			</span>
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
		background-color: var(--testo);
		padding: 0.2rem;
		border-radius: 0.3rem;
		color: var(--sfondo);
		font-weight: 600;
	}


	p {
		cursor: pointer;
		font-size: 1rem;
        box-shadow: var(--neumorphism);
        transition: var(--velocita);
        padding: 0.2rem;
        border-radius: 0.3rem;
		display: flex;
		align-items: center	;
		gap: 0.2em;
	}

    p:hover{
        box-shadow: var(--innerNeu);
        scale: var(--premuto);
    }
</style>
