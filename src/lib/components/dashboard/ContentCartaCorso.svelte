<script>
	import { db } from '$lib/firebaseConfig';

	import { deleteDoc, doc } from 'firebase/firestore';
	import ModalEliminaSingoloCorso from './ModalEliminaSingoloCorso.svelte';

	export let corso;
	export let open;

	const eliminaCorso = () => {
		// Elimina il corso da firebase
		// TO-DO --> Elimina tutte le domande, recensioni, risposte e tutto che ha a che fare col corso

		deleteDoc(doc(db, 'corsidelcdl', corso.id))
			.then(() => {})
			.catch((error) => {
				alert(error.message);
			});
	};
</script>

<div class="corso">
	<div class="carta-corso">
		<div class="modifica" on:click={open}>
			<div class="anno-element anno{corso.data().anno}">
				<p>{corso.data().anno}</p>
			</div>

			<div class="info">
				<p class="nome">{corso.data().nome.toUpperCase()}</p>
				<p>CFU - {corso.data().cfu}</p>
				<p>Codice - {corso.data().codiceCorso}</p>
			</div>
		</div>
	</div>
	<ModalEliminaSingoloCorso {corso} />
</div>

<style>

	.corso{
		display: grid;
		grid-template-columns: 2fr 0fr;
		gap: 1em;
	}
	.carta-corso {
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		align-items: center;
		box-shadow: var(--neumorphism);
		border-radius: 0.4rem;
		padding: 0.3rem;
		cursor: pointer;
		transition: var(--velocita);
	}

	.carta-corso:hover {
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}
	.modifica {
		display: flex;
		gap: 1rem;
		justify-content: left;
		align-items: center;
		border-radius: 0.4rem;
		padding: 0.3rem;
		cursor: pointer;
	}

	.info {
		display: flex;
		flex-direction: column;
	}
	.info > p {
		padding: 0;
		margin: 0.2rem;
	}
	.anno-element {
		font-size: 2.5rem;
		font-weight: 600;
		height: 75px;
		width: 75px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.5rem;
		box-shadow: var(--innerNeu);
	}

	.nome {
		font-weight: 600;
	}

	@media screen and (max-width: 500px) {
		.carta-corso {
			flex-direction: column;
		}

		.modifica {
			flex-direction: column;
			text-align: center;
		}

		.corso{
			grid-template-columns: 1fr;
		}
		
	}
</style>
