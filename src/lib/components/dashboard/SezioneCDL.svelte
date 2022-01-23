<script>
	import { db } from '$lib/firebaseConfig';

	import { collection, onSnapshot } from 'firebase/firestore';

	import { onMount } from 'svelte';
	import ModalAggiungiCdl from '../utilities/ModalAggiungiCDL.svelte';
	import ElementoLista from './ElementoLista.svelte';
	import { flip } from 'svelte/animate';
	import { crossfade } from 'svelte/transition';
	let listaCorsi = [];

	const [send, receive] = crossfade({});

	let listaFiltrata = [];
	let filtro = '';
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
	<div class="sezione-bottoni">
		<ModalAggiungiCdl {listaCorsi} />
		<div class="ricerca">
			<span>🔍</span><input bind:value={filtro} type="text" />
		</div>
	</div>

	<div class="sezione-lista">
		<p class="titolo-lista">Lista corsi presenti</p>
		{#if filtro.length != 0}
			<div class="lista-corsi">
				{#if listaFiltrata.length != 0}
					<!-- Ci sarà un foreach -->
					{#each listaFiltrata as corso (corso.id)}
						<div
							in:receive|local={{ key: corso.id }}
							out:send|local={{ key: corso.id }}
							animate:flip={{ duration: 100 }}
							class="div"
						>
							<ElementoLista {corso} />
						</div>
					{/each}
				{:else}
					<p class="not-found">Nessun corso corrispondente</p>
				{/if}
			</div>
		{:else}
			<div class="lista-corsi">
				<!-- Ci sarà un foreach -->
				<!-- Local fa in modo che la transition venga applicata solo al parent, e non a tutti gli elmenti all'interno -->

				{#each listaCorsi as corso (corso.id)}
					<div
						in:receive|local={{ key: corso.id }}
						out:send={{ key: corso.id }}
						animate:flip={{ duration: 100 }}
						class="div"
					>
						<ElementoLista {corso} />
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.sezione-cdl {
		width: 90%;
		border-radius: 0.5rem;
		padding: 0.8rem;
		box-shadow: var(--innerNeu);
		margin: 2em;
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
</style>
