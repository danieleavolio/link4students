<script>
	import { db } from '$lib/firebaseConfig';

	import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';

	import { onMount } from 'svelte';

	import Appunto from '../utilities/Appunto.svelte';

	import ModalAppunti from '../utilities/ModalAppunti.svelte';
	import Vuoto from '../utilities/Vuoto.svelte';

	export let corso;
	let appunti = [];

	onMount(() => {
		const queryAppunti = query(collection(db, 'appunti'), where('idCorso', '==', corso.data().codiceCorso));
		onSnapshot(queryAppunti, (snapshot) => {
			appunti = snapshot.docs;
		});
	});
</script>

<div class="container">
	<h1>Lista degli appunti</h1>
	<div class="utilities">
		<ModalAppunti {corso} />
	</div>
	{#if appunti.length == 0}
		<Vuoto oggetti={'appunti'} />
	{:else}
		<div class="lista-appunti">
			{#each appunti as appunto (appunto.id)}
				<Appunto {appunto} />
			{/each}
		</div>
	{/if}
</div>

<style>
	h1 {
		text-align: center;
	}
	.container {
		margin-bottom: 2rem;
		width: 90vw;
	}

	.lista-appunti {
		display: flex;
		gap: 4rem;
		margin: 1rem 0;
		overflow-x: scroll;
		overflow-y: hidden;
		white-space: nowrap;
		padding: 1rem 0;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 80%;
		margin: auto;
	}

	.utilities {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
</style>
