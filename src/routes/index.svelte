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
	import { collection, doc, getDoc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import ListaAnnunci from '$lib/components/utilities/ListaAnnunci.svelte';

	export let statistiche;

	let annunci = [];
	let moreThan3 = false;

	onMount(() => {
		let queryAnnunci = query(collection(db, 'annunci'),orderBy('data', 'desc'), limit(4));
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
		<BoxLink nome="Unisciti a noi!" emoji="login" linkto="/reg/joinus" />
	{:else}
		<BoxLink nome="Profilo" emoji="account_circle" linkto="/profilo/{$authStore.user.uid}" />
	{/if}

	<BoxLink nome="Corsi" emoji="school" linkto="/corsi" />
	<BoxLink nome="Ricerca" emoji="search" linkto="/ricerca"/>
</div>

<BoxStatistiche {statistiche} />
<h2>Lista annunci</h2>
<div class="container-lista">
	<ListaAnnunci {annunci} modificando={false} />
</div>
{#if moreThan3}
	<a class="ref-annunci" href="/annunci"
		><span class="material-icons"> campaign </span> Vai agli annunci</a
	>
{/if}

<style>
	h1 {
		font-weight: 900;
		font-size: 3rem;
		text-align: center;
	}

	.main-links {
		background-color: var(--sfondo);
		display: flex;
		gap: 1rem;
		padding: 1rem;
		border-radius: 10px;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}

	.container-lista {
		display: flex;
		justify-content: center;
		flex-direction: column;
		box-shadow: var(--neumorphism);
		padding: 2rem;
		border-radius: 1rem;
		gap: 2em;
		flex-wrap: wrap;
		margin: 1em;
	}

	.ref-annunci {
		border: var(--bordo);
		text-decoration: none;
		color: var(--testo);
		font-weight: 700;
		padding: 0.3rem;
		border-radius: 0.4rem;
		margin: 1rem;
		font-size: 1.3rem;
		transition: var(--velocita);
		display: flex;
		align-items: center;
		gap: 1em;
	}

	.ref-annunci:hover {
		background-color: var(--testo);
		color: var(--sfondo);
	}

	@media screen and (max-width: 500px){
		.main-links{
			flex-direction: column;
		}
	}
</style>
