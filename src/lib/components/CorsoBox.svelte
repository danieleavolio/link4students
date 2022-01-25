<script>
	import { goto } from '$app/navigation';

	export let corso;
</script>

<div class="carta-corso" on:click={() => goto(`corso/${corso.id}`)}>
	<div class="anno-element anno{corso.data().anno}">
		<p>{corso.data().anno}</p>
	</div>

	<div class="info">
		<p class="nome">{corso.data().nome.toUpperCase()}</p>
		<p>CFU - {corso.data().cfu}</p>
		<p>Codice - {corso.data().codiceCorso}</p>
	</div>
</div>

<style>
	.carta-corso {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 1rem;
		justify-content: left;
		align-items: center;
		box-shadow: var(--neumorphism);
		border-radius: 0.4rem;
		padding: 0.3rem;
		cursor: pointer;
		transition: var(--velocita);
		height: 100%;
	}

	.carta-corso:hover{
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
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
		border-radius: 1rem;
		box-shadow: var(--innerNeu);
		margin: 0.3rem;
	}


	.nome {
		font-weight: 600;
	}
</style>
