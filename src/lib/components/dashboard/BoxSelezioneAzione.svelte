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
		box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
		padding: 1rem;
	}

	.left {
		border-radius: 0.8rem;
		font-size: 3rem;
		width: 100px;
		height: 100px;
		background-color: blueviolet;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.right {
		font-size: 2rem;
	}
</style>
