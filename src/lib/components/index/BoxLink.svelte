<script>
	import { goto } from '$app/navigation';

	export let nome;
	export let emoji;
	export let linkto;

	const redirectTo = (linkto) => {
        goto(linkto)
    };
</script>

<div on:click={() => redirectTo(linkto)} class="container">
	<p class="emoji">{emoji}</p>
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
		background-color: var(--sfondo);
        cursor: pointer;
        transition: var(--velocita);
		border: var(--bordo);
	}

    .container:hover{
       box-shadow: var(--innerNeu);
	   transform: var(--premuto);
	   
    }
	.emoji{
		justify-self: center;
		align-self: center;
		font-size: 4rem;
		margin: 0;
		width: 100px;
		text-align: center;
	}

	
</style>
