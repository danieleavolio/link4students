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
		display: flex;
		gap: 1rem;
		justify-content: left;
		align-items: center;
		box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
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
		background-color: red;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.5rem;
	}

	.anno1 {
		background-color: greenyellow;
	}

	.anno2 {
		background-color: yellow;
	}

	.anno3 {
		background-color: red;
	}

	.anno4 {
		background-color: darkred;
	}

	.anno5 {
		background-color: rgb(29, 29, 29);
		color: white;
	}

	.anno6 {
		background-color: black;
		color: white;
	}

	.nome {
		font-weight: 600;
	}
</style>
