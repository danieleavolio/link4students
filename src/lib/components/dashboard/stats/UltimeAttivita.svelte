<script>
	import { db } from '$lib/firebaseConfig';
	import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import ElementoAct from './ElementoAct.svelte';

	//Devo prendere TUTTO, ma magari mi limito alle ultime 5 cose
	const limitQuery = 5;

	let listaTotale = [];

	const [send, receive] = crossfade({});

	$: if (listaTotale.length > 0)
		listaTotale = listaTotale.sort((a, b) => b.data().data - a.data().data);

	const queryAppunti = query(collection(db, 'appunti'), orderBy('data', 'desc'), limit(limitQuery));
	const queryRecensioni = query(
		collection(db, 'recensioni'),
		orderBy('data', 'desc'),
		limit(limitQuery)
	);
	const queryDomande = query(collection(db, 'domande'), orderBy('data', 'desc'), limit(limitQuery));
	const queryRisposte = query(
		collection(db, 'risposte'),
		orderBy('data', 'desc'),
		limit(limitQuery)
	);

	let listaRec = [];
	let listaDom = [];
	let listaRis = [];
	let listaApp = [];

	onMount(() => {
		onSnapshot(queryRecensioni, (res) => {
			listaRec = res.docs;
		});
		onSnapshot(queryAppunti, (res) => {
			listaApp = res.docs;
		});
		onSnapshot(queryDomande, (res) => {
			listaDom = res.docs;
		});
		onSnapshot(queryRisposte, (res) => {
			listaRis = res.docs;
		});
	});

	$: listaTotale = listaRec.concat(listaApp.concat(listaDom.concat(listaRis)));
</script>

<div class="last-activities">
	<p>Ultime attività sul sito</p>
	<div class="lista-scroll">
		{#each listaTotale as elemento (elemento.id)}
			<div
				in:receive={{ key: elemento.id }}
				out:send={{ key: elemento.id }}
				animate:flip
				class="elemento"
			>
				{#if elemento.ref.parent.id == 'domande'}
					<ElementoAct {elemento} tipo={'domanda'} emoji={'quiz'} />
				{:else if elemento.ref.parent.id == 'risposte'}
					<ElementoAct {elemento} tipo={'risposta'} emoji={'question_answer'} />
				{:else if elemento.ref.parent.id == 'appunti'}
					<ElementoAct {elemento} tipo={'appunti'} emoji={'edit'} />
				{:else if elemento.ref.parent.id == 'recensioni'}
					<ElementoAct {elemento} tipo={'recensione'} emoji={'reviews'} />
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.last-activities {
		box-shadow: var(--neumorphism);
		padding: 1rem;
		border-radius: 1rem;
	}

	.lista-scroll {
		display: flex;
		flex-direction: column;
		height: 400px;
		overflow: scroll;
		scroll-behavior: smooth;
	}
</style>
