<script context="module">
	import { db } from '$lib/firebaseConfig';

	import { collection, query, where, getDocs } from 'firebase/firestore';
	// Quando la pagina si carica, prendi la lista degli esami
	export async function load({ page }) {
		const cdsid = page.params.cdsid;
		const queryToDo = query(collection(db, 'corsidelcdl'), where('cdl', '==', cdsid));
		let corsi = [];
		await getDocs(queryToDo).then((res) => {
			corsi = res.docs;
		});
		return {
			props: { corsi }
		};
	}
</script>

<script>
	import BackButton from '$lib/components/utilities/BackButton.svelte';
	import CorsoBox from '$lib/components/CorsoBox.svelte';

	export let corsi;

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
<div class="ordina-div">
	<label for="ordina">Ordina per:</label>
	<select bind:value={ordinaPer} name="ordina" id="ordina">
		<option value="anno">Anno</option>
		<option value="cfu">CFU</option>
		<option value="nome">Nome</option>
	</select>
	<span>🔎</span><input bind:value={filtro} type="text" />
</div>
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

<style>
	.ordina-div {
		padding: 1.2rem;
		font-size: 1.1rem;
		margin: 1rem;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
		border-radius: 0.4rem;
	}

	select {
		font-size: 1.1rem;
	}
	.lista {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}
</style>
