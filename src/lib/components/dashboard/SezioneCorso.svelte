<script>
	import { db } from '$lib/firebaseConfig';

	import { collection, onSnapshot } from 'firebase/firestore';

	import { onMount } from 'svelte';
	import ElementoListaNoDel from './ElementoListaNoDel.svelte';
	import GestioneSingoloCorso from './GestioneSingoloCorso.svelte';
	let listaCorsi = [];

	let listaFiltrata = [];
	let filtro = '';

    // Per evitare problemi che non venga renderizzata la lista
	let cdlSelezionato = '';

	const cambiaCdlSelezionato = (cdl) => {
		cdlSelezionato = cdl;
	};

	const indietro = () => {
		cdlSelezionato = '';
	};

	onMount(() => {
		// Prendo la lista dei corsi
		onSnapshot(collection(db, 'corsidilaurea'), (corsi) => {
			listaCorsi = corsi.docs;
		});
	});

	$: listaFiltrata = listaCorsi.filter((corso) =>
		corso.data().nome.toLowerCase().includes(filtro.toLowerCase())
	);
</script>

<div class="sezione-cdl">
	{#if cdlSelezionato!=''}
		<button on:click={indietro} class="indietro">Indietro</button>
		<GestioneSingoloCorso {cdlSelezionato} />
	{:else}
		<div class="sezione-bottoni">
			<div class="ricerca">
				<span class="trova">Trova corso <span class="material-icons">
					search
					</span></span><input bind:value={filtro} type="text" />
			</div>
		</div>

		<div class="sezione-lista">
			{cdlSelezionato}
			<p class="titolo-lista">Lista corsi presenti</p>
			{#if filtro.length != 0}
				<div class="lista-corsi">
					{#if listaFiltrata.length != 0}
						<!-- Ci sarà un foreach -->
						{#each listaFiltrata as corso (corso.id)}
							<div class="div">
								<ElementoListaNoDel {corso} {cambiaCdlSelezionato} />
							</div>
						{/each}
					{:else}
						<p class="not-found">Nessun corso corrispondente</p>
					{/if}
				</div>
			{:else}
				<div class="lista-corsi">
					<!-- Ci sarà un foreach -->
					{#each listaCorsi as corso (corso.id)}
						<div class="div">
							<ElementoListaNoDel {corso} {cambiaCdlSelezionato} />
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.sezione-cdl {
		width: 90%;
		border-radius: 1rem;
		padding: 0.8rem;
		box-shadow: var(--innerNeu);
		margin: 1.5rem 0;
	}
	.sezione-bottoni {
		display: flex;
		justify-content: space-around;
	}

	.sezione-lista {
		border-radius: 0.5rem;
		padding: 0 0.4rem;
	}

	.titolo-lista {
		font-weight: 600;
		padding: 0 0.5rem;
		font-size: 1.5rem;
	}

	.indietro {
		background-color: var(--submit);
		font-size: 1.2rem;
		outline: none;
		border-radius: 0.5rem;
		cursor: pointer;
		color: var(--sfondo);
	}

	.indietro:hover{
		box-shadow: var(--submitHover);
	}

	.lista-corsi {
		padding: 1rem;
		display: grid;
		grid-template-columns: auto auto;
		flex-wrap: wrap;
		gap: 2rem;
		padding: 1rem;
	}

	.not-found {
		font-weight: 600;
		margin: auto;
	}

	span {
		font-size: 1.2rem;
	}

	.trova{
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1em;
	}

	.ricerca{
		display: flex;
		gap: 0.5em;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}

	
	@media screen and (max-width:850px){
		.lista-corsi{
			grid-template-columns: 1fr;
		}	
	}
	
</style>
