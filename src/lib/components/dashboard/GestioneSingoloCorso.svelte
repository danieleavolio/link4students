<script>
	import { db } from '$lib/firebaseConfig';

	import { collection, onSnapshot, query, where } from 'firebase/firestore';

	import { onMount } from 'svelte';
	import ModalAggiungiCorso from '../utilities/ModalAggiungiCorso.svelte';
	import CartaCorso from './CartaCorso.svelte';

	export let cdlSelezionato;
	let listaCorsi = [];

	onMount(() => {
		const queryCorsi = query(collection(db, 'corsidelcdl'), where('cdl', '==', cdlSelezionato.id));
		onSnapshot(queryCorsi, (snapshot) => {
			listaCorsi = snapshot.docs;
		});
	});
</script>

<div class="pannello-corso">
	<ModalAggiungiCorso {listaCorsi} cdl={cdlSelezionato} />
	<div class="lista-corsi">
		{#each listaCorsi as corso (corso.id)}
			<CartaCorso {corso} />
		{/each}
	</div>
</div>

<style>
	.lista-corsi {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
        margin: 1rem 0;
	}
</style>
