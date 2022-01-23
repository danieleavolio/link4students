<script>
	let annunci = [];

	onMount(() => {
		let queryAnnunci = query(collection(db, 'annunci'));
		onSnapshot(queryAnnunci, (lista) => {
			annunci = lista.docs;
		});
	});
	import { db } from '$lib/firebaseConfig';

	import { addDoc, collection, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import ListaAnnunci from '../utilities/ListaAnnunci.svelte';

	let titolo;
	let contenuto;
	let tipo = 'message';
	let modificando = false;

	const handleEdit = () => {
		modificando = !modificando;
	};

	const pubblicaAnnuncio = async () => {
		let data = serverTimestamp();

		const dati = {
			titolo,
			contenuto,
			tipo,
			data
		};

		addDoc(collection(db, 'annunci'), dati).then(() => {
			titolo = '';
			contenuto = '';
		});
	};
</script>

<h1>Gestione degli annunci</h1>

<h3>Aggiungi un nuovo annuncio</h3>
<div class="div-creazione">
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

		<button class="pubblica">Pubblica</button>
	</form>
	<div class="div-tipo">
		<button on:click={() => (tipo = 'alert')} class={tipo == 'alert' ? 'avvertenza' : ''}
			><span class="material-icons "> campaign </span> Avvertenza</button
		>
		<button on:click={() => (tipo = 'message')} class={tipo == 'message' ? 'messaggio' : ''}
			><span class="material-icons"> email </span>Annuncio</button
		>
	</div>
</div>

<h3>Lista annunci</h3>
<div class="sezione-annunci">
	{#if !modificando}
		<button class="edit" on:click={handleEdit}><span class="material-icons"> delete </span></button>
	{:else}
		<button class="edit" on:click={handleEdit}><span class="material-icons"> save </span></button>
	{/if}
	<ListaAnnunci {annunci} bind:modificando />
</div>

<style>
	.sezione-annunci {
		width: 80vw;
		box-shadow: var(--neumorphism);
		padding: 1rem;
		border-radius: 1rem;
		gap: 2em;
		display: flex;
		flex-direction: column;
	}

	h1,
	h3 {
		text-align: center;
	}

	form {
		display: flex;
		flex-direction: column;
		font-size: 1.2em;
		width: 80%;
		gap: 1em;
	}

	input {
		font-size: 1.1em;
	}

	.pubblica {
		color: var(--submit);
		border-radius: 0.4rem;
		cursor: pointer;
		font-size: 1.1em;
		width: fit-content;
		margin: auto;
	}

	.pubblica:hover {
		background-color: var(--submit);
		box-shadow: var(--submitHover);
		color: var(--sfondo);
	}

	.edit {
		font-size: 2em;
		border-radius: 1em;
		padding: 0.3em;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		width: fit-content;
	}

	.div-creazione {
		display: grid;
		grid-template-columns: auto auto;
		place-items: center;
		width: 90%;
		box-shadow: var(--neumorphism);
		padding: 1em;
		border-radius: 1em;
	}

	.div-tipo {
		display: flex;
		flex-direction: column;
		gap: 2em;
	}

	.div-tipo > button {
		display: flex;
		gap: 1em;
		font-size: 1.3em;
		padding: 0.4em 0.4em;
		cursor: pointer;
		border-radius: 0.4em;
	}

	.avvertenza {
		background-color: var(--alert);
		color: var(--sfondo);
	}

	.messaggio {
		background-color: var(--submit);
		color: var(--sfondo);
	}

	.avvertenza:hover,
	.messaggio:hover {
		box-shadow: var(--neumorphism);
		transform: scale(1);
	}
</style>
