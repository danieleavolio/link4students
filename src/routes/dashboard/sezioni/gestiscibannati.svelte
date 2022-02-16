<script context="module">
	export async function load({}) {
		let listaBannati = [];
		const qBannati = query(collection(db, 'banTimes'));
		const idBannati = await getDocs(qBannati);
		for (const bannato of idBannati.docs) {
			await getDoc(doc(db, 'users', bannato.id)).then((user) => {
				listaBannati = [...listaBannati, user];
			});
		}

		return {
			props: { idBannati, listaBannati }
		};
	}
</script>

<script>
	import { goto } from '$app/navigation';

	import { db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';

	import {
		collection,
		deleteDoc,
		doc,
		getDoc,
		getDocs,
		onSnapshot,
		query
	} from 'firebase/firestore';
	import { onMount } from 'svelte';
	export let listaBannati;
	export let idBannati;

	onMount(async () => {
		if ($authStore.isLoggedIn) {
			if (!$authStore.isAdmin) goto('/');
		} else {
			goto('/');
		}
	});

	const deleteBan = (uid) => {
		deleteDoc(idBannati.docs[idBannati.docs.map((e) => e.id).indexOf(uid)].ref);
		listaBannati = listaBannati.filter((elem) => elem.id != uid);
	};
</script>

<h1>Gestione degli utenti sospesi</h1>
<div class="container">
	<h3>Lista degli utenti bannati</h3>
	{#if listaBannati.length > 0}
		<div class="lista-bannati">
			{#each listaBannati as bannato}
				<div class="utente-bannato">
					<div class="avatar">
						<img src={bannato.data().avatar} alt="" />
					</div>
					<p class="nome-cognome">{bannato.data().nome} {bannato.data().cognome}</p>
					<button on:click={() => deleteBan(bannato.id)} class="unban">Unban</button>
				</div>
			{/each}
		</div>
	{:else}
		<p class="nessuno"><span class="material-icons"> person </span> Non ci sono utenti bannati</p>
	{/if}
</div>

<style>
	h3,
	h1 {
		text-align: center;
	}
	.container {
		width: 90%;
		display: flex;
		justify-content: center;
		align-items: center;
		align-self: center;
		flex-direction: column;
	}

	.lista-bannati {
		gap: 1em;
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.utente-bannato {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		place-items: center;
		box-shadow: var(--neumorphism);
		border-radius: 0.5em;
		padding: 0.5em;
		width: 50%;
		place-self: center;
		margin: 1em;
	}
	.avatar {
		width: 80px;
		height: 80px;
		border-radius: 100%;
		border: var(--bordo);
	}

	img {
		width: 80px;
		height: 80px;
		object-fit: cover;
		border-radius: 100%;
	}
	.unban {
		color: var(--resolve);
		width: fit-content;
		font-size: 1.2em;
		border-radius: 0.3em;
		cursor: pointer;
	}

	.nessuno {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.2em;
		box-shadow: var(--innerNeu);
		border-radius: 0.5rem;
		padding: 0.5em;
	}

	.material-icons {
		font-size: 2em;
	}

	@media screen and (max-width: 800px) {
		.utente-bannato {
			grid-template-columns: 1fr;
		}
	}
</style>
