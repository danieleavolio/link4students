<script context="module">
	import { db } from '$lib/firebaseConfig';
	import { collection, getDocs } from 'firebase/firestore';

	let arr = [];
	export async function load({}) {
		await getDocs(collection(db, 'corsidilaurea')).then((snap) => {
			arr = snap.docs;
		});

		return {
			props: { arr }
		};
	}
</script>

<script lang="ts">
	import CdlBox from '$lib/components/CdlBox.svelte';
	export let arr;

	let filterArr = [];

	let keyword = '';

	$: filterArr = arr.filter((elem) =>
		elem.data().nome.toLowerCase().includes(keyword.toLowerCase())
	);
</script>

<svelte:head>
	<title>Corsi di Laurea</title>
</svelte:head>
<h1>Corsi</h1>
<div class="search">
	<span class="material-icons"> search </span><input type="text" bind:value={keyword} />
</div>
<div class="corsi">
	{#if filterArr.length > 0}
		{#each filterArr as corso}
			<CdlBox nome={corso.data().nome} cdsId={corso.id} />
		{/each}
	{:else if keyword.length > 0}
		<p class="nothing"><span class="material-icons"> search_off </span> Nessun risultato</p>
	{:else}
		{#each arr as corso}
			<CdlBox nome={corso.data().nome} cdsId={corso.id} />
		{/each}
	{/if}
</div>

<style>
	.corsi {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		box-shadow: var(--innerNeu);
		padding: 2rem;
		border-radius: 1rem;
		margin: 1em;
	}
	input{
		font-size: 1.5em!important;
	}

	h1 {
		font-size: 3rem;
		font-weight: 600;
	}
	.search,
	.nothing {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 1em;
	}

	.nothing{
		font-size: 2em;
		text-align: center;

	}

	@media screen and (max-width: 700px){
		.corsi{
			grid-template-columns: 1fr;
			text-align: center	;
		}
	}

	@media screen and (max-width: 350px){
		input{
			width: 80%;
		}
	}
</style>
