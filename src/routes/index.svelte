<script context="module">
	export async function load({}) {
		console.log('ciao');
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
	import { doc, getDoc, onSnapshot } from 'firebase/firestore';
	let imagesLinks = [];

	// onMount(() => {
	// 	listAll(imagesRef)
	// 		.then((res) => {
	// 			res.items.forEach((itemRef) => {
	// 				getDownloadURL(itemRef).then((url) => {
	// 					imagesLinks = [...imagesLinks, url];
	// 				});
	// 			});
	// 		})
	// 		.catch((error) => {
	// 			imagesLinks = [];
	// 		});
	// });

	export let statistiche;
</script>

<svelte:head>
	<title>Home-page</title>
</svelte:head>

<h1>Link 4 Students</h1>

<div class="main-links">
	{#if !$authStore.isLoggedIn}
		<BoxLink nome="Unisciti a noi!" image="highfive" linkto="joinus" />
	{:else}
		<BoxLink nome="Profilo" image="userPic" linkto="profilo/{$authStore.user.uid}" />
	{/if}

	<BoxLink nome="Corsi" image="corsi" linkto="corsi" />
	<BoxLink nome="Portale" image="unical" linkto="www.unical.it" />
</div>

<BoxStatistiche {statistiche} />

<style>
	h1 {
		font-weight: 900;
		font-size: 3rem;
	}

	.main-links {
		background-color: cornflowerblue;
		display: flex;
		gap: 1rem;
		padding: 1rem;
		border-radius: 10px;
	}
</style>
