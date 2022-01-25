<script lang="ts">
	import { db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';
	import { esamiLibretto } from '$lib/stores/esamiLibretto';

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

	let mediaVoti = corso.data().mediaVoti == null ? '❌' : Math.round(corso.data().mediaVoti);

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
					<p class="singola-diff">
						Difficolta: <span class="material-icons acceso">
							{stampaEmoji(corso.data().mediaDifficolta, 'psychology ')}
						</span>
						<span class="mancanti material-icons spento">
							{stampaEmoji(difficoltaMancante, 'psychology ')}
						</span>
					</p>
					<p class="singola-diff">
						Utilita: <span class="material-icons acceso"
							>{stampaEmoji(corso.data().mediaUtilita, 'stars ')}</span
						>
						<span class="mancanti material-icons spento">
							{stampaEmoji(utilitaMancante, 'stars ')}
						</span>
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
		<!-- Se hai aggiunto l'esame al libretto, puoi lasciare una recensione -->
		{#if $esamiLibretto.find((elem) => elem.data().codiceCorso == corso.data().codiceCorso)}
			{#if !recensito}
				<p>Hai superato l'esame?</p>
				<p>Lascia una recensione!</p>
				<ModalRecensione idCorso={corso.data().codiceCorso} nome={corso.data().nome} />
			{:else}
				<p class="hai-recensito">
					Hai recensito questo esame! <span class="material-icons"> check_circle </span>
				</p>
			{/if}
		{/if}
	{/if}
</div>
<!-- container per le recensioni e altro -->
<div class="second-container">
	{#if !$authStore.isLoggedIn}
		<div class="signin-todo">
			<p class="annuncio">
				Per interagire con la comunity, effettua <a href="/reg/joinus" class="action">
					unisciti a noi
					<span class="material-icons"> logout </span>
				</a>
			</p>
		</div>
	{/if}
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
		<BoxAppunti {corso} />
	{/if}
</div>

<style>

	h1{
		text-align: center;
	}
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
		background: var(--sfondo);
		box-shadow: var(--innerNeu);
		border-radius: 1rem;
		width: 100%;
	}

	.right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0.5rem;
		width: 100%;
		align-items: center;
		box-shadow: var(--innerNeu);
		border-radius: 1rem;
	}

	.mancanti {
		font-weight: 600;
		color: var(--testo);
	}

	.acceso {
		color: var(--submit);
	}

	.media {
		text-align: center;
		border-radius: 0.5rem;
		box-shadow: var(--innerNeu);
		border-radius: 3rem;
	}

	.media > h3 {
		font-size: 3rem;
		padding: 3rem;
		margin: 0;
	}

	.hai-recensito {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1em;
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
		font-size: 1.4rem;
		border-radius: 10px;
		border: none;
		outline: none;
		padding: 10px;
		cursor: pointer;
		background-color: var(--sfondo);
	}

	.singola-diff {
		box-shadow: var(--innerNeu);
		padding: 1rem;
		border-radius: 1rem;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.signin-todo {
		font-size: 1.2em;
		box-shadow: var(--innerNeu);
		padding: 0.5em;
		border-radius: 0.5em;
		margin: 1em;
	}

	.annuncio {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.2em;
	}

	.action {
		box-shadow: var(--neumorphism);
		padding: 0.3em;
		border-radius: 0.5em;
		cursor: pointer;
		color: var(--submit);
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.2em;
		text-decoration: none;
		transition: var(--velocita);
	}

	.action:hover{
		box-shadow: var(--innerNeu);
	}

	/* Responsive */
	@media screen and (max-width: 1000px){
		.corso-container{
			grid-template-columns: 1fr;
		}
	}

	@media screen and (max-width: 700px){
		.left{
			display: grid;
			grid-template-columns: 1fr;
		}
		.media{
			justify-content: center;
			align-items: center;
			place-self: center;
			margin: 1em;
		}
	}

	@media screen and (max-width: 550px){
		.box-bottoni{
			display: grid;
			grid-template-columns: 1fr;
			gap: 1em;
		}
	}


</style>
