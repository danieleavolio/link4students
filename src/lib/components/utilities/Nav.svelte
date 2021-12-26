<script lang="ts">
	import { authStore } from '$lib/stores/authStore';
	import { fly } from 'svelte/transition';
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth, db } from '$lib/firebaseConfig';
	import { collection, getDocs, query, where } from '@firebase/firestore';
	import { esamiRecensiti } from '$lib/stores/recensioniStore';
	const logout = async () => {
		await auth.signOut();
	};

	onAuthStateChanged(auth, (fbUser) => {
		if (fbUser) {
			let data = {
				isLoggedIn: true,
				user: fbUser
			};
			authStore.update((oldStore) => data);
			// Quando loggo prendo l'id degli esami e li passo allo store apposito
			let idEsami = [];
			let queryIdEsami = query(
				collection(db, 'recensioni'),
				where('idAutore', '==', auth.currentUser.uid)
			);
			getDocs(queryIdEsami).then((res) => {
				res.docs.forEach((doc) => {
					idEsami = [...idEsami, doc.data().idCorso];
				});
				esamiRecensiti.update((old) => idEsami);
			});
		} else {
			let data = {
				isLoggedIn: false,
				user: null
			};
			authStore.update((oldStore) => data);
		}
	});
</script>

<nav>
	<a href="/">Link4Students</a>
	<a href="/corsi">Corsi</a>
	<a href="/info">Info</a>
	<div class="div">
		{#if $authStore.isLoggedIn == true}
			<a transition:fly={{ y: 200, duration: 1000 }} href="/profilo/{auth.currentUser.uid}"
				>{$authStore.user.email}</a
			>
			<button class="logout" on:click={logout}>Logout</button>
		{:else if !$authStore.isLoggedIn && $authStore.isLoggedIn != undefined}
			<a transition:fly={{ y: -200, duration: 500 }} href="/joinus">Unisciti</a>
		{/if}
	</div>
</nav>

<style>
	nav {
		width: 100%;
		height: 50px;
		background-color: purple;
		display: flex;
		flex-wrap: wrap;
		gap: 1em;
		align-items: center;
		justify-content: center;
		position: sticky;
		top: 0;
		left: 0;
	}

	a {
		color: white;
		text-decoration: none;
		outline: none;
	}

	.logout {
		font-size: 1.1rem;
		border: none;
		background-color: crimson;
		color: white;
		border-radius: 8px;
		padding: 6px;
		cursor: pointer;
	}
</style>
