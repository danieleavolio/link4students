<script context="module">
	import { db } from '$lib/firebaseConfig';

	import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
	// Quando la pagina si carica, prendi la lista degli esami
	export async function load({ page }) {
		const cdsid = page.params.cdsid;
		const queryToDo = query(collection(db, 'corsidelcdl'), where('cdl', '==', cdsid));
		let corsi = [];
		let nomeCorso = await getDoc(doc(db, 'corsidilaurea', cdsid));
		nomeCorso = nomeCorso.data().nome;
		await getDocs(queryToDo).then((res) => {
			corsi = res.docs;
		});
		return {
			props: { corsi, nomeCorso }
		};
	}
</script>

<script>
	import BackButton from '$lib/components/utilities/BackButton.svelte';
	import CorsoBox from '$lib/components/CorsoBox.svelte';
	import { onMount } from 'svelte';

	export let corsi;
	export let nomeCorso;

	let ordinaPer = 'anno';
	// Sorting corsi
	$: if (ordinaPer == 'cfu') {
		corsi = corsi.sort((a, b) => a.data().cfu - b.data().cfu);
	} else if (ordinaPer == 'anno') {
		corsi = corsi.sort((a, b) => a.data().anno - b.data().anno);
	} else if (ordinaPer == 'nome') {
		corsi = corsi.sort((a, b) => a.data().nome.localeCompare(b.data().nome));
	}

	let listaFiltrata = [];
	let filtro = '';
	// Script per filtering lista
	$: listaFiltrata = corsi.filter((elem) =>
		elem.data().nome.toLowerCase().includes(filtro.toLowerCase())
	);
</script>

<BackButton />
<h1>{nomeCorso}</h1>
<div class="ordina-div">
	{#if corsi.length > 0}
		<label for="ordina"
			>Ordina per:

			<select bind:value={ordinaPer} name="ordina" id="ordina">
				<option value="anno">Anno</option>
				<option value="cfu">CFU</option>
				<option value="nome">Nome</option>
			</select>
		</label>
		<div class="search">
			<span class="material-icons"> search </span><input bind:value={filtro} type="text" />
		</div>
	{:else}
		<div class="vuoto">
			<span class="material-icons emoji"> description </span>
			<p class="testo">Non ci sono corsi disponibili per questo Corso di Laurea</p>
		</div>
	{/if}
</div>
{#if corsi.length > 0}
	<div class="lista">
		{#if listaFiltrata.length < 0}
			{#each corsi as corso (corso.id)}
				<CorsoBox {corso} />
			{/each}
		{:else}
			{#each listaFiltrata as corso (corso.id)}
				<CorsoBox {corso} />
			{/each}
		{/if}
	</div>
{/if}

<style>

	h1{
		text-align: center;
	}
	.ordina-div {
		padding: 1.2rem;
		font-size: 1.1rem;
		margin: 1rem;
		box-shadow: var(--innerNeu);
		border-radius: 0.4rem;
		display: flex;
		gap: 1em;
		justify-content: center;
		align-items: center;
	}

	select {
		font-size: 1.1rem;
		background-color: var(--sfondo);
		border-radius: 0.5rem;
		border: var(--bordo);
		outline: none;
	}

	input {
		border: var(--bordo);
		outline: none;
		box-shadow: var(--innerNeu);
		padding: 0.3rem;
		border-radius: 0.5rem;
	}
	.lista {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		padding: 1rem;
		box-shadow: var(--innerNeu);
		margin: 1rem;
		border-radius: 1rem;
	}

	.vuoto {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.emoji {
		font-size: 3rem;
		margin: 0;
		border-radius: 0.5rem;
		box-shadow: var(--neumorphism);
		background-color: var(--sfondo);
	}

	.testo {
		font-size: 2rem;
	}

	.search {
		display: flex;
		gap: 1em;
		justify-content: center;
		align-items: center;
	}

	@media screen and (max-width: 700px) {
		.lista {
			grid-template-columns: 1fr;
		}
	}

	@media screen and (max-width: 500px) {
		.ordina-div {
			display: grid;
			grid-template-columns: 1fr;
		}
	}
</style>
