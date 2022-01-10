<script>
	export let emoji;
	export let azione;
	export let clickAzione;

	const chooseAzione = () => {
		if (emoji == '🎓') {
			clickAzione('addCdl');
		} else if (emoji == '📜') {
			clickAzione('addCorso');
		}
	};
</script>

<div on:click={chooseAzione} class="container">
	<div class="left">
		<p>{emoji}</p>
	</div>
	<div class="right">
		<p>{azione}</p>
	</div>
</div>

<style>
	.container {
		display: flex;
		width: max-content;
		border-radius: 0.8rem;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		box-shadow: var(--neumorphism);
		padding: 1rem;
		transition: var(--velocita);
		cursor: pointer;
	}

	.container:hover{
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}

	.left {
		border-radius: 0.8rem;
		font-size: 3rem;
		width: 100px;
		height: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: var(--innerNeu);
		font-weight: 600;
	}

	.right {
		font-size: 2rem;
	}
</style>
