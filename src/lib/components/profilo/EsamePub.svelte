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
	if (esame.data().voto > 26) colore = 'ottimo';
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
			<p alt="ciao">{esame.data().nomeCorso}</p>
		</div>
	</div>
	{#if $authStore.isLoggedIn}
		{#if $authStore.user.uid == esame.data().uidUtente}
			<ModalModEsame {esame} />
		{/if}
	{/if}
</div>

<style>

	.esame{
		display: flex;
	}
	.esame-libretto {
		width: 80%;
		display: grid;
		grid-template-columns: 1fr 2fr;
		border-radius: 0.4rem;
		box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
		margin: 0.4rem;
		place-items: center;
		cursor: pointer;
	}

	.sinistra {
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
		border-radius: 0.4rem;
	}
	.voto {
		padding: 0 1rem;
	}

	.destra {
		display: flex;
		justify-content: left;
		align-items: flex-start;
	}

	.ottimo {
		background-color: rgb(0, 255, 136);
	}
	.medio {
		background-color: rgb(59, 95, 255);
	}
	.sufficiente {
		background-color: rgb(255, 255, 80);
	}
</style>
