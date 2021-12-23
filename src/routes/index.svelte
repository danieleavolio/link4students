<script lang="ts">
	const imagesRef = ref(storage, 'images');
	import { getDownloadURL, listAll, ref } from 'firebase/storage';
	import { onMount } from 'svelte';
	import BoxLink from '$lib/components/utilities/BoxLink.svelte';
	import { authStore } from '$lib/stores/authStore';
import { storage } from '$lib/firebaseConfig';
	let imagesLinks = [];

	onMount(() => {
		listAll(imagesRef)
			.then((res) => {
				res.items.forEach((itemRef) => {
					getDownloadURL(itemRef).then((url) => {
						imagesLinks = [...imagesLinks, url];
					});
				});
			})
			.catch((error) => {
				imagesLinks = [];
			});
	});
</script>

<svelte:head>
	<title>Home-page</title>
</svelte:head>

<h1>Link 4 Students</h1>

<div class="main-links">
	{#if !$authStore.isLoggedIn}
		<BoxLink  nome="Unisciti a noi!" image="highfive" linkto="joinus" />
	{:else}
		<BoxLink nome="Profilo" image="userPic" linkto="profilo/{$authStore.user.uid}" />
	{/if}

	<BoxLink nome="Corsi" image="corsi" linkto="corsi"></BoxLink>
	<BoxLink nome="Portale" image="unical" linkto="www.unical.it"></BoxLink>

</div>

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
