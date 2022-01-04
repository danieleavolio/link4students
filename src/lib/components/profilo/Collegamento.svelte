<script>
	import { goto } from '$app/navigation';
	import { db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';
	import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
	export let collegamento;

	const gotoProfilo = () => {
		goto(`/profilo/${collegamento.data().idCollegato}`);
	};

	const eliminaCollegamento = async () => {
		// Devo eliminare 2 collegamenti.
		// Il collegamento idUtente --> idCollegato
		// Il collegamento idCollegato --> idUtente

		await deleteDoc(collegamento.ref);
		// Prendo l'altro documento.
		const queryCollegamentoInverso = query(
			collection(db, 'collegamenti'),
			where('idCollegato', '==', $authStore.user.uid),
			where('idUtente', '==', collegamento.data().idCollegato)
		);
		getDocs(queryCollegamentoInverso).then((collegamento) => {
			deleteDoc(collegamento.docs[0].ref);
		});
	};
</script>

<div class="collegamento">
	<div class="avatar" on:click={gotoProfilo}>
		<img src={collegamento.data().avatarCollegato} alt="" />
	</div>

	<div class="nome-cognome">
		<p>{collegamento.data().nomeCognomeCollegato}</p>
	</div>
	{#if $authStore.isLoggedIn}
		{#if collegamento.data().idUtente == $authStore.user.uid}
			<button on:click={eliminaCollegamento}>❌</button>
		{/if}
	{/if}
</div>

<style>
	.collegamento {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		padding: 0.5rem;
		margin: 0.5rem;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
		border-radius: 0.5rem;
	}
	.avatar {
		width: 50px;
		height: 50px;
		border-radius: 100%;
		cursor: pointer;
		border: rgb(183, 0, 255) solid;
	}

	.avatar > img {
		width: 50px;
		height: 50px;
		object-fit: cover;
		border-radius: 100%;
	}

	button {
		padding: 0.5rem;
		font-size: 1rem;
		border-radius: 0.4rem;
		border: none;
		cursor: pointer;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
	}
</style>
