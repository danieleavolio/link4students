<script>
import { goto } from "$app/navigation";


	export let utentiGenerali;
</script>

<div class="lista-utenti">
	<p class="nome-box">Lista utenti</p>
	<div class="lista-scroll">
		{#each utentiGenerali as utente (utente.id)}
			<div class="utente-lista">
				<p on:click={() => goto(`/profilo/${utente.id}`)}>
					🎓 {utente.data().nome}
					{utente.data().cognome}
				</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.lista-utenti {
		box-shadow: var(--neumorphism);
		width: fit-content;
		border-radius: 1rem;
		padding: 1rem;
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
		padding: 1px;
	}

	.utente-lista:hover {
		box-shadow: var(--innerNeu);
	}
</style>
