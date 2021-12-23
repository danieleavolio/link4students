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
		box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1rem;
		border-radius: 10px;
		background-color: aliceblue;
        cursor: pointer;
        transition: all 0.5s cubic-bezier(0.39, 0.575, 0.565, 1)
	}

    .container:hover{
        box-shadow: 0 10px 5px rgba(0, 0, 0, 0.2);
        background-color: antiquewhite;

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
