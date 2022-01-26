<script>
	import { goto } from '$app/navigation';

	export let utentiGenerali;

	let listaFiltrata = [];
	let keyword = '';

	$: listaFiltrata = utentiGenerali.filter((elem) =>
		elem.data().nome.toLowerCase().includes(keyword.toLowerCase())
	);
</script>

<div class="lista-utenti">
	<p class="nome-box">Lista utenti</p>
	<div class="filtro">
		<span class="material-icons"> search </span>
		<input type="text" bind:value={keyword} />
	</div>
	<div class="lista-scroll">
		{#if keyword.length > 0}
			{#each listaFiltrata as utente (utente.id)}
				<div class="utente-lista">
					<p on:click={() => goto(`/profilo/${utente.id}`)}>
						<span class="material-icons"> account_circle </span>
						{utente.data().nome}
						{utente.data().cognome}
					</p>
				</div>
			{/each}
		{:else}
			{#each utentiGenerali as utente (utente.id)}
				<div class="utente-lista">
					<p on:click={() => goto(`/profilo/${utente.id}`)}>
						<span class="material-icons"> account_circle </span>
						{utente.data().nome}
						{utente.data().cognome}
					</p>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.lista-utenti {
		box-shadow: var(--neumorphism);
		width: fit-content;
		border-radius: 1rem;
		padding: 1rem;
	}

	.filtro{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.nome-box {
		font-size: 1.2rem;
		font-weight: 600;
	}

	.lista-scroll {
		overflow-y: scroll;
		height: 300px;
		padding: 1rem;
	}

	.utente-lista {
		cursor: pointer;
		transition: var(--velocita);
		border-radius: 0.3rem;
	}

	.utente-lista:hover {
		box-shadow: var(--innerNeu);
	}

	p {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5em;
	}

	input{
		width: 100%;
	}

	@media screen and (max-width: 1000px){
		.lista-utenti{
			width: 90%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			place-self: center;
			margin: 1em;
		}
	}
</style>
