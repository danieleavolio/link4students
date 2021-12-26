<script>
	import { db } from '$lib/firebaseConfig';
	import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import Recensione from '../utilities/Recensione.svelte';

	export let idCorso;

	let recensioni = [];

	onMount(() => {
		// Realtime updates
		const queryRecensioni = query(collection(db, 'recensioni'), where('idCorso', '==', idCorso));
		const realTimeRecensioni = onSnapshot(queryRecensioni, (querySnapshot)=>{
			recensioni = querySnapshot.docs;
		})
		// getDocs(queryRecensioni).then((res) => {
		// 	recensioni = res.docs;
		// });
	});
</script>

<div class="container">
	<h1>Lista delle recensioni</h1>

	<div class="lista-recensioni">
		{#each recensioni as recensione(recensione.id)}
			<Recensione {recensione} />
		{/each}
	</div>
</div>

<style>
    .container{
        margin-bottom: 2rem;
    }

	.lista-recensioni{
		display: flex;
		gap: 1rem;
	}
</style>
