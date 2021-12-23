<script lang="ts">
	import ModalRecensione from '../utilities/ModalRecensione.svelte';

	import BoxAppunti from './BoxAppunti.svelte';
	import BoxDomande from './BoxDomande.svelte';
	import BoxRecensioni from './BoxRecensioni.svelte';
	import InfoCorso from './InfoCorso.svelte';

	export let corso;

	let recensioni;
	let domande;
	let appunti;

	let scelta;
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
		console.log(scelta);
	};
</script>

<h1>{corso.data().nome}</h1>
<div class="container">
	<div class="corso-container">
		<div class="left">
			<div class="media">
				<h3>26</h3>
			</div>
			<InfoCorso {corso} />
		</div>
		<div class="right" />
	</div>
	<div class="recensione-box">
		<p>Hai superato l'esame?</p>
		<p>Lascia una recensione!</p>
		<ModalRecensione idCorso={corso.data().codiceCorso} />
	</div>
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
		<BoxRecensioni />
	{:else if scelta == 'Domande'}
		<BoxDomande />
	{:else if scelta == 'Appunti'}
		<BoxAppunti />
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
	}

	.left {
		display: flex;
		gap: 1rem;
		justify-content: space-around;
		align-items: center;
		background: blueviolet;
		color: white;
	}

	.media {
		width: 100px;
		text-align: center;
		background: yellowgreen;
		height: 100%;
	}

	.media > h3 {
		font-size: 3rem;
		color: black;
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
