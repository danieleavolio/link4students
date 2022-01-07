<script>
	import { goto } from '$app/navigation';

	export let nome;
	export let image;
	export let linkto;

	const redirectTo = (linkto) => {
        goto(linkto)
    };
</script>

<div on:click={() => redirectTo(linkto)} class="container">
	<div class="image-div">
		<img src="/images/{image}.png" alt="" />
	</div>
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
		border-radius: 10px;
		background-color: var(--sfondo);
        cursor: pointer;
        transition: all 0.3s ease-in-out;
	}

    .container:hover{
       box-shadow: var(--innerNeu)
	   
    }
	.image-div {
		width: 100px;
		height: 100px;
	}

	.image-div > img {
		width: 100%;
		height: 100%;
	}
</style>
