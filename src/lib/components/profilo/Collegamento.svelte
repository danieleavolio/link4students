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

<div class="collegamento" on:click={gotoProfilo}>
	<div class="avatar">
		<img src={collegamento.data().avatarCollegato} alt="" />
	</div>

	<div class="nome-cognome">
		<p>{collegamento.data().nomeCognomeCollegato}</p>
	</div>
</div>
{#if $authStore.isLoggedIn}
		{#if collegamento.data().idUtente == $authStore.user.uid}
			<button class="elimina-collegamento" on:click={eliminaCollegamento}><span class="material-icons">
				clear
				</span></button>
		{/if}
	{/if}

<style>
	.collegamento {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr 2fr;
		place-items: center;
		padding: 0.5rem;
		margin: 0.5rem;
		box-shadow: var(--neumorphism);
		border-radius: 0.5rem;
		transition: var(--velocita);
		cursor: pointer;
		width: 100%;
	}

	.collegamento:hover{
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}
	.avatar {
		width: 50px;
		height: 50px;
		border-radius: 100%;
		cursor: pointer;
	}

	.avatar > img {
		width: 50px;
		height: 50px;
		object-fit: cover;
		border-radius: 100%;
	}

	.elimina-collegamento {
		padding: 0.5rem;
		font-size: 1rem;
		cursor: pointer;
		border: var(--bordo);
		box-shadow: var(--neumorphism);
		border-radius: 0.5rem;
		transition: var(--velocita);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.material-icons{
		color: var(--alert);
		font-size: 2em;
	}

	.elimina-collegamento:hover{
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}
</style>
