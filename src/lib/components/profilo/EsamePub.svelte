<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import ModalModEsame from './ModalModEsame.svelte';

	export let esame;
	const paginaCorso = () => {
		goto(`/corsodilaurea/corso/${esame.data().uidCorso}`);
	};

	let colore = '';
	// Controllo per il voto
	$: if (esame.data().voto > 26) colore = 'ottimo';
	else if (esame.data().voto > 22) colore = 'medio';
	else colore = 'sufficiente';
</script>

<div class="esame">
	<div class="esame-libretto" on:click={paginaCorso}>
		<div class="sinistra {colore}">
			<p class="voto">
				{esame.data().voto}
				{#if esame.data().lode}
					<span>L</span>
				{/if}
			</p>
		</div>
		<div class="destra">
			<p  class="nome-corso" alt="nome corso">{esame.data().nomeCorso}</p>
		</div>
	</div>
	{#if $authStore.isLoggedIn}
		{#if $authStore.user.uid == esame.data().uidUtente}
			<ModalModEsame {esame} />
		{/if}
	{/if}
</div>

<style>
	.esame {
		display: flex;
		justify-content: center;
		gap: 1em;
		margin: 1em;
	}
	.esame-libretto {
		width: 80%;
		display: grid;
		grid-template-columns: 1fr 2fr;
		border-radius: 0.4rem;
		box-shadow: var(--neumorphism);
		margin: 0.4rem;
		cursor: pointer;
		padding: 0.2rem;
		transition: var(--velocita);
	}

	.esame-libretto:hover{
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}

	.sinistra {
		box-shadow: var(--innerNeu);
		border-radius: 1.2em;
		width: 75px;
		height: 75px;
		place-self: center;
		background-color: var(--sfondo);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0.3em;

	}

	.voto{
		font-weight: 800;
		font-size: 1.4rem;
	}
	
	.nome-corso{
		font-size: 1.2em;
		text-align: left;
	}

	.destra {
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.ottimo {
		color: var(--ottimo);
	}
	.medio {
		color: var(--buono);
	}
	.sufficiente {
		color: var(--discreto);
	}

	@media screen and (max-width:450px){
		.esame-libretto{
			grid-template-columns: 1fr;
		}

		.destra{
			justify-content: center;
		}
		.nome-corso{
			text-align: center;
		}
	}
</style>
