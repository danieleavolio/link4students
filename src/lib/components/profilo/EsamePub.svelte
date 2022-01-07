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
			<p alt="nome corso">{esame.data().nomeCorso}</p>
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
		box-shadow: var(--neumorphism);
		border-radius: 100%;
		width: 50px;
		height: 50px;
		place-self: center;
		background-color: var(--sfondo);
		box-shadow: var(--neumorphism);
	}

	.voto{
		font-weight: 800;
	}
	

	.destra {
		display: flex;
		justify-content: left;
		align-items: flex-start;
	}

	.ottimo {
		color: rgb(23, 117, 87);
	}
	.medio {
		color: rgb(27, 9, 126);
	}
	.sufficiente {
		color: rgb(128, 98, 16);
	}
</style>
