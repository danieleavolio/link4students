<script>
	import { db } from '$lib/firebaseConfig';

	import { collection, onSnapshot } from 'firebase/firestore';

	import { onMount } from 'svelte';
	import ElementoLista from './ElementoLista.svelte';
	let listaCorsi = [];

	let listaFiltrata = [];
	let filtro = '';
	onMount(() => {
		// Prendo la lista dei corsi
		onSnapshot(collection(db, 'corsidistudio'), (corsi) => {
			listaCorsi = corsi.docs;
		});
	});

    $: listaFiltrata = listaCorsi.filter((corso) => corso.data().nome.toLowerCase().includes(filtro.toLowerCase()))
    
</script>

<div class="sezione-cdl">
	<p class="titolo">Aggiungi Corso di Laurea</p>

	<div class="sezione-bottoni">
		<button> Add Corso -- MODAL </button>

		<div class="ricerca">
			<span>🔍</span><input bind:value={filtro} type="text" />
		</div>
	</div>

	<div class="sezione-lista">
		<p class="titolo-lista">Lista corsi presenti</p>
		<hr />
		{#if filtro.length != 0}
			<div class="lista-corsi">
				{#if listaFiltrata.length != 0}
					<!-- Ci sarà un foreach -->
					{#each listaFiltrata as corso (corso.id)}
						<ElementoLista nome={corso.data().nome} />
					{/each}
                    {:else}
                        <p class="not-found">Nessun corso corrispondente</p>
				{/if}
			</div>
		{:else}
			<div class="lista-corsi">
				<!-- Ci sarà un foreach -->
				{#each listaCorsi as corso (corso.id)}
					<ElementoLista nome={corso.data().nome} />
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.sezione-cdl {
		width: 100%;
		border-radius: 0.3rem;
		padding: 0 0.8rem;
	}
	.sezione-bottoni {
		display: flex;
		justify-content: space-around;
	}

	.sezione-lista {
		box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
		border-radius: 0.5rem;
		padding: 0 0.4rem;
	}

	.titolo-lista {
		font-weight: 600;
		padding: 0 0.5rem;
	}

	hr {
		color: black;
		width: 80%;
		border: black solid 1px;
		border-radius: 1rem;
	}

	.lista-corsi {
		padding: 1rem;
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
	}

    .not-found{
        font-weight: 600;
        margin: auto;
    }
</style>
