<script>
	import { goto } from '$app/navigation';
import { db } from '$lib/firebaseConfig';
import { deleteDoc, doc } from 'firebase/firestore';

	export let segnalazione;
	export let risolviRecensione;
	// Quando una recensione viene risolta, viene rimossa dalla UI
	const risolviSegnalazione = () =>{
		deleteDoc(doc(db,'segnalazioniRecensioni', segnalazione.id)).then(()=>{
			risolviRecensione(segnalazione.id)
			alert("Segnalazione risolta");
		})
	}
</script>

<div class="main-container">
	<div class="contenuto">
		<p>{segnalazione.data().contenutoSegnalazione}</p>
	</div>
	<div class="bottoni">
		<button
			on:click={() => goto(`/profilo/${segnalazione.data().idSegnalatore}`)}
			class="segnalatore"
		>
			🔗 SEGNALATORE</button
		>
		<button on:click={risolviSegnalazione} class="risolvi">Risolvi segnalazione </button>
	</div>
</div>

<style>
	.bottoni {
		display: flex;
		gap: 1rem;
	}
	.segnalatore {
		font-weight: 600;
		border-radius: 8px;
		padding: 0.5rem;
		margin: 0.5rem 0;
		width: fit-content;
		border: none;
	}
	.risolvi {
		font-weight: 600;
		border-radius: 8px;
		padding: 0.5rem;
		margin: 0.5rem 0;
		background-color: rgb(107, 238, 107);
		border: none;
		cursor: pointer;
		width: 170px;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all 1s ease;
	}

	.risolvi:hover {
		background-color: rgb(15, 160, 59);
	}

	.main-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		white-space: normal;
		justify-content: center;
	}

	.contenuto {
		font-size: 1.1rem;
	}
</style>
