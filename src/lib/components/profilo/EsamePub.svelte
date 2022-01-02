<script>
	import { goto } from '$app/navigation';

	export let esame;
	const paginaCorso = () => {
		goto(`/corsodilaurea/corso/${esame.data().uidCorso}`);
	};
</script>

<div class="esame-libretto" on:click={paginaCorso}>
	<div class="sinistra">
		<p class="voto">
			{esame.data().voto}
			{#if esame.data().lode}
				<span>L</span>
			{/if}
		</p>
	</div>
	<div class="destra">
		<p>{esame.data().nomeCorso}</p>
	</div>
</div>

<style>
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
</style>
