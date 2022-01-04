<script lang="ts">
	import { db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';

	import { doc, onSnapshot } from 'firebase/firestore';

	import ModalRecensione from '../utilities/ModalRecensione.svelte';

	import BoxAppunti from './BoxAppunti.svelte';
	import BoxDomande from './BoxDomande.svelte';
	import BoxRecensioni from './BoxRecensioni.svelte';
	import InfoCorso from './InfoCorso.svelte';

	export let corso;
	export let recensito: boolean;

	let recensioni;
	let domande;
	let appunti;
	let scelta;

	// Variabili dinamiche
	$: difficoltaMancante = 5 - corso.data().mediaDifficolta;
	$: utilitaMancante = 5 - corso.data().mediaUtilita;
	

	let mediaVoti = corso.data().mediaVoti == null ? '❌' : corso.data().mediaVoti;

	// Real-time updates per le info date dagli studenti
	onSnapshot(doc(db, 'corsidelcdl', corso.id), (documento) => {
		corso = documento;
	});

	const stampaEmoji = (quantita, emoji) => {
		let stringaEmoji = '';
		for (let i = 1; i <= quantita; i++) {
			stringaEmoji += emoji;
		}

		return stringaEmoji;
	};

	const handleClickBottoni = (value) => {
		switch (value.target.firstChild.data) {
			case 'Recensioni':
				recensioni.style = 'opacity: 1;';
				domande.style = 'opacity: 0.5;';
				appunti.style = 'opacity: 0.5;';
				scelta = value.target.firstChild.data;

				break;
			case 'Domande':
				recensioni.style = 'opacity: 0.5;';
				domande.style = 'opacity: 1;';
				appunti.style = 'opacity: 0.5;';
				scelta = value.target.firstChild.data;
				break;
			case 'Appunti':
				recensioni.style = 'opacity: 0.5;';
				domande.style = 'opacity: 0.5;';
				appunti.style = 'opacity: 1;';
				scelta = value.target.firstChild.data;
				break;
			default:
				recensioni.style = 'opacity: 0.5;';
				domande.style = 'opacity: 0.5;';
				appunti.style = 'opacity: 0.5;';
				break;
		}
	};
</script>

<h1>{corso.data().nome}</h1>
<div class="container">
	<div class="corso-container">
		<div class="left">
			<div class="media">
				<h3>{mediaVoti}</h3>
			</div>
			<InfoCorso {corso} />
		</div>
		<div class="right">
			<p>Valutazione degli studenti</p>
			{#if corso.data().numRecensioni}
				<div class="difficolta">
					<p>
						Difficolta: <span> {stampaEmoji(corso.data().mediaDifficolta, '🧠')} </span>
						<span class="mancanti"> {stampaEmoji(difficoltaMancante, '🧠')} </span>
					</p>
					<p>
						Utilita: <span>{stampaEmoji(corso.data().mediaUtilita, '🎓')}</span>
						<span class="mancanti"> {stampaEmoji(utilitaMancante, '🎓')} </span>
					</p>
				</div>
			{:else}
				<p>Ancora nessuna valutazione!</p>
			{/if}
		</div>
	</div>
</div>
<div class="recensione-box">
	{#if $authStore.isLoggedIn}
		{#if !recensito}
			<p>Hai superato l'esame?</p>
			<p>Lascia una recensione!</p>
			<ModalRecensione idCorso={corso.data().codiceCorso} nome={corso.data().nome} />
		{:else}
			<p>Hai recensito questo esame! ☑️</p>
		{/if}
	{/if}
</div>
<!-- container per le recensioni e altro -->
<div class="second-container">
	<div class="box-bottoni">
		<button bind:this={recensioni} on:click={handleClickBottoni}>Recensioni</button>
		<button bind:this={domande} on:click={handleClickBottoni}>Domande</button>
		<button bind:this={appunti} on:click={handleClickBottoni}>Appunti</button>
	</div>

	<!-- Mostrare in base alla scelta fatta -->
	{#if scelta == 'Recensioni'}
		<BoxRecensioni idCorso={corso.data().codiceCorso} />
	{:else if scelta == 'Domande'}
		<BoxDomande idCorso={corso.data().codiceCorso} />
	{:else if scelta == 'Appunti'}
		<BoxAppunti idCorso={corso.data().codiceCorso} />
	{/if}
</div>

<style>
	.container {
		max-width: 90vw;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.corso-container {
		width: 80%;
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 1rem;
		justify-content: center;
	}

	.left {
		display: flex;
		gap: 1rem;
		justify-content: space-evenly;
		align-items: center;
		background: blueviolet;
		color: white;
		width: 100%;
	}

	.right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		background-color: brown;
		padding: 0.5rem;
		width: 100%;
		align-items: center;
	}

	.mancanti {
		font-weight: 600;
	}

	.media {
		text-align: center;
		background: yellowgreen;
		border-radius: 0.5rem;
	}

	.media > h3 {
		font-size: 3rem;
		padding: 3rem;
		color: black;
		margin: 0;
	}

	.recensione-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.second-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		max-width: 800px;
		width: 100%;
	}
	.box-bottoni {
		padding: 4rem;
		display: flex;
		justify-content: space-around;
		width: 80%;
	}
	.box-bottoni > button {
		opacity: 0.5;
		font-size: 1rem;
		border-radius: 10px;
		border: none;
		outline: none;
		padding: 10px;
		cursor: pointer;
		background-color: blueviolet;
		color: white;
	}
</style>
