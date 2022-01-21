<script context="module">
	export async function load({}) {
		let statistiche;
		// Temporaneo

		await getDoc(doc(db, 'statistiche', 'infoSito')).then((doc) => {
			statistiche = doc.data();
		});

		await onSnapshot(doc(db, 'statistiche', 'infoSito'), (doc) => {
			statistiche = doc.data();
		});

		return {
			props: {
				statistiche
			}
		};
	}
</script>

<script lang="ts">
	const imagesRef = ref(storage, 'images');
	import { ref } from 'firebase/storage';
	import BoxLink from '$lib/components/index/BoxLink.svelte';
	import { authStore } from '$lib/stores/authStore';
	import { db, storage } from '$lib/firebaseConfig';
	import BoxStatistiche from '$lib/components/index/BoxStatistiche.svelte';
	import { collection, doc, getDoc, limit, onSnapshot, query } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import ListaAnnunci from '$lib/components/utilities/ListaAnnunci.svelte';

	export let statistiche;

	let annunci = [];
	let moreThan3 = false;

	onMount(() => {
		let queryAnnunci = query(collection(db, 'annunci'), limit(4));
		onSnapshot(queryAnnunci, (lista) => {
			annunci = lista.docs;
			if (annunci.length > 3) {
				annunci.pop();
				moreThan3 = true;
			}
		});
	});
</script>

<svelte:head>
	<title>Home-page</title>
</svelte:head>

<h1>Link 4 Students</h1>

<div class="main-links">
	{#if !$authStore.isLoggedIn}
		<BoxLink nome="Unisciti a noi!" emoji="👏" linkto="joinus" />
	{:else}
		<BoxLink nome="Profilo" emoji="👥" linkto="profilo/{$authStore.user.uid}" />
	{/if}

	<BoxLink nome="Corsi" emoji="🎓	" linkto="corsi" />
	<BoxLink nome="Ricerca" emoji="🔎" linkto="ricerca" />
</div>

<BoxStatistiche {statistiche} />
<h2>Lista annunci</h2>

<div class="container-lista">
	<ListaAnnunci {annunci} />
</div>
{#if moreThan3}
	<a class="ref-annunci" href="/annunci">📢 Vai agli annunci</a>
{/if}

<style>
	h1 {
		font-weight: 900;
		font-size: 3rem;
	}

	.main-links {
		background-color: var(--sfondo);
		display: flex;
		gap: 1rem;
		padding: 1rem;
		border-radius: 10px;
	}

	.container-lista {
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: var(--innerNeu);
		padding: 1rem;
		border-radius: 0.3rem;
	}

	.ref-annunci {
		border: var(--bordo);
		text-decoration: none;
		color: var(--testo);
		font-weight: 700;
		padding: 0.3rem;
		border-radius: 0.4rem;
		margin:1rem;
		font-size: 1.3rem;
		transition: var(--velocita);
	}

	.ref-annunci:hover{
		background-color: var(--testo);
		color: var(--sfondo);
	}
</style>
