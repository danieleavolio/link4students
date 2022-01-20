<script>
	let annunci = [];

	onMount(() => {
		let queryAnnunci = query(collection(db, 'annunci'));
		onSnapshot(queryAnnunci, (lista) => {
			annunci = lista.docs;
		});
	});
	import { db } from '$lib/firebaseConfig';

	import {
		addDoc,
		collection,
		getDocs,
		onSnapshot,
		query,
		serverTimestamp
	} from 'firebase/firestore';
	import { onMount } from 'svelte';

	import AnnuncioDash from './AnnuncioDash.svelte';

	let titolo;
	let contenuto;
	let tipo = 'message';

	const pubblicaAnnuncio = () => {
		const dati = {
			titolo,
			contenuto,
			tipo,
			data: serverTimestamp()
		};

		addDoc(collection(db, 'annunci'), dati).then(() => {
			titolo = '';
			contenuto = '';
		});
	};
</script>

<div class="sezione-annunci">
	<h1>Gestione degli annunci</h1>
	<div class="lista-annunci">
		{#each annunci as annuncio}
			<AnnuncioDash {annuncio} />
		{/each}
	</div>

	<div class="sezione-aggiunta">
		<h3>Aggiungi un nuovo annuncio</h3>
		<div class="container-form">
			<form action="" on:submit|preventDefault={pubblicaAnnuncio}>
				<label for="titolo">Titolo</label>
				<input bind:value={titolo} id="titolo" type="text" placeholder="Aggiungi un titolo.." />
				<label for="contenuto">Contenuto Annuncio</label>
				<textarea
					bind:value={contenuto}
					name="contenuto"
					id="contenuto"
					cols="30"
					rows="3"
					placeholder="Aggiungi un contenuto.."
				/>
				<select bind:value={tipo} name="tipo" id="tipo">
					<option value="message">Annuncio ✉️</option>
					<option value="alert">Avvertenza 📢</option>
				</select>
				<button class="pubblica">Pubblica</button>
			</form>
		</div>
	</div>
</div>

<style>
	.sezione-annunci {
		width: 80vw;
		box-shadow: var(--neumorphism);
		padding: 1rem;
		border-radius: 1rem;
	}
	.lista-annunci {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}

	h1,
	h3 {
		text-align: center;
	}

	.container-form {
		display: flex;
		justify-content: center;
	}
	form {
		display: flex;
		flex-direction: column;
		width: 80%;
	}

	input {
		font-size: 1rem;
	}
	select {
		box-shadow: var(--neumorphism);
		border: var(--bordo);
		border-radius: 0.3rem;
		margin: 0.3rem;
		width: fit-content;
		outline: none;
		font-size: 1rem;
	}

	option {
		background-color: var(--sfondo);
		font-size: 1rem;
	}

	.pubblica {
		color: var(--submit);
		border-radius: 0.4rem;
		cursor: pointer;
	}

	.pubblica:hover {
		background-color: var(--submit);
		box-shadow: var(--submitHover);
		color: var(--sfondo);
	}
</style>
