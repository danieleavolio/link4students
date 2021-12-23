<script context="module">
	import { db } from '$lib/firebaseConfig';
	import { collection, getDocs } from 'firebase/firestore';

	let array = [];
	export async function load({}) {
		await getDocs(collection(db, 'corsidistudio')).then((snap) => {
			array = snap.docs;
		});

		return {
			props: {}
		};
	}
</script>

<script lang="ts">
	import CdlBox from '$lib/components/CdlBox.svelte';
</script>
<svelte:head>
	<title>Corsi di Laurea</title>
</svelte:head>
<h1>Corsi</h1>
<div class="corsi">
	{#each array as corso}
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
