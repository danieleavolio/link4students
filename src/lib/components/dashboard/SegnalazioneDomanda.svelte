<script>
	import { goto } from '$app/navigation';
	import { db } from '$lib/firebaseConfig';
	import { deleteDoc, doc } from 'firebase/firestore';

	export let segnalazione;
	export let risolviSegnalazioneDomanda;
	// Quando una recensione viene risolta, viene rimossa dalla UI
	const risolviSegnalazione = () => {
		deleteDoc(doc(db, 'segnalazioniDomande', segnalazione.id)).then(() => {
			risolviSegnalazioneDomanda(segnalazione.id);
		});
	};
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
			<span class="material-icons"> account_circle </span> SEGNALATORE</button
		>
		<button on:click={risolviSegnalazione} class="risolvi">Risolvi segnalazione </button>
	</div>
</div>

<style>
	.bottoni {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}
	.segnalatore {
		font-weight: 600;
		border-radius: 8px;
		padding: 0.5rem;
		margin: 0.5rem 0;
		width: fit-content;
		display: flex;
		align-items: center;
		gap: 0.5em;
	}
	.risolvi {
		font-weight: 600;
		border-radius: 8px;
		padding: 0.5rem;
		margin: 0.5rem 0;
		cursor: pointer;
		width: 170px;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all 1s ease;
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
