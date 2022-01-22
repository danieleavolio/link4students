<script>
	import { goto } from '$app/navigation';

	export let nome;
	export let emoji;
	export let linkto;

	const redirectTo = (linkto) => {
		goto(linkto);
	};
</script>

<div on:click={() => redirectTo(linkto)} class="container">
	<p class="emoji"><span class="material-icons">{emoji} </span></p>
	<p>{nome}</p>
</div>

<style>
	.container {
		box-shadow: var(--neumorphism);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1rem;
		border-radius: 1rem;
		background: var(--sfondoComp);
		cursor: pointer;
		transition: var(--velocita);
		border: var(--bordo);
	}

	.container:hover {
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}
	.emoji {
		justify-self: center;
		align-self: center;
		margin: 0;
		width: 100px;
		text-align: center;
		font-family: -webkit-pictograph;
	}

	.emoji > span{
		font-size: 4em;
	}
</style>
