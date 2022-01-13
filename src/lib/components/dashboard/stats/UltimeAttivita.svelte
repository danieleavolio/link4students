<script>
	import { db } from '$lib/firebaseConfig';
	import { collection, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { onMount } from 'svelte';

	//Devo prendere TUTTO, ma magari mi limito alle ultime 5 cose
	const limitQuery = 5;

	let listaTotale = [];
    let show;


    const showTrue = () =>{
        show = true;
    }

    const showFalse = () =>{
        show = false;
    }



	$: if (listaTotale.length > 0)
		listaTotale = listaTotale.sort((a, b) => a.data().data - b.data().data);

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

	onMount(() => {
		onSnapshot(queryRecensioni, (res) => {
			listaTotale = [...listaTotale, ...res.docs];
		});
		onSnapshot(queryAppunti, (res) => {
			listaTotale = [...listaTotale, ...res.docs];
		});
		onSnapshot(queryDomande, (res) => {
			listaTotale = [...listaTotale, ...res.docs];
		});
		onSnapshot(queryRisposte, (res) => {
			listaTotale = [...listaTotale, ...res.docs];
		});
	});
</script>

<div class="last-activities">
	<p>Ultime attività sul sito</p>
	<div class="lista-scroll">
		{#each listaTotale as elemento (elemento.id)}
			{#if elemento.ref.parent.id == 'domande'}
				<p>❓{elemento.data().nome} ha fatto una domanda</p>
			{:else if elemento.ref.parent.id == 'risposte'}
				<p>❗ {elemento.data().nomeRispondente} ha risposto ad una domanda</p>
			{:else if elemento.ref.parent.id == 'appunti'}
				<p>✒️ {elemento.data().nome} ha caricato degli appunti</p>
			{:else if elemento.ref.parent.id == 'recensioni'}
				<p>📃 {elemento.data().nome} ha scritto una recensione</p>
			{/if}
			
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
