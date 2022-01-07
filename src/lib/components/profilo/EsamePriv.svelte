<script>
	import { goto } from '$app/navigation';

	export let nome;
	export let uidCorso;

	const paginaCorso = () => {
		goto(`/corsodilaurea/corso/${uidCorso}`);
	};
</script>

<div class="esame-libretto" on:click={paginaCorso}>
	<div class="sinistra">
		<p class="voto">🎓</p>
	</div>
	<div class="destra">
		<p>{nome}</p>
	</div>
</div>

<style>
	.esame-libretto {
		width: 80%;
		padding: 0.5rem;
		display: grid;
		grid-template-columns: 1fr 2fr;
		border-radius: 0.4rem;
		box-shadow: var(--neumorphism);
		margin: 0.4rem;
		place-items: center;
		cursor: pointer;
		transition: var(--velocita);
		margin: 1rem auto;
	}

	.esame-libretto:hover{
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}

	.sinistra {
		border-radius: 0.4rem;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
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
