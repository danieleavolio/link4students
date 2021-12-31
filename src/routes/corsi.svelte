<script context="module">
	import { db } from '$lib/firebaseConfig';
	import { collection, getDocs } from 'firebase/firestore';

	let arr = [];
	export async function load({}) {
		await getDocs(collection(db, 'corsidilaurea')).then((snap) => {
			arr = snap.docs;
		});

		return {
			props: {arr}
		};
	}
</script>

<script lang="ts">
	import CdlBox from '$lib/components/CdlBox.svelte';
	export let arr;
</script>
<svelte:head>
	<title>Corsi di Laurea</title>
</svelte:head>
<h1>Corsi</h1>
<div class="corsi">
	{#each arr as corso}
		<CdlBox nome={corso.data().nome} cdsId={corso.id} />
	{/each}
</div>

<style>
	.corsi {
		display: grid;
		grid-template-columns: auto auto;
		gap: 1rem;
	}

	h1 {
		font-size: 3rem;
		font-weight: 600;
	}
</style>
