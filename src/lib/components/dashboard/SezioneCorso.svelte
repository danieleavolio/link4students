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
				<span>Trova corso🔍</span><input bind:value={filtro} type="text" />
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
		width: 100%;
		border-radius: 0.3rem;
		padding: 0.8rem;
		box-shadow: 0 5px 5px rgba(0, 0, 0, 0.4);
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
	}

	.indietro {
		background-color: blue;
		color: white;
		font-size: 1.2rem;
		border: none;
		outline: none;
		border-radius: 0.5rem;
		cursor: pointer;
	}

	.lista-corsi {
		padding: 1rem;
		display: grid;
		grid-template-columns: auto auto;
		flex-wrap: wrap;
		gap: 2rem;
		box-shadow: 0 5px 5px rgba(0, 0, 0, 0.4);
		padding: 1rem;
	}

	.not-found {
		font-weight: 600;
		margin: auto;
	}

	span {
		font-size: 1.2rem;
	}
</style>
