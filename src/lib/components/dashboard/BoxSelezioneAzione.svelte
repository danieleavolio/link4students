<script>
	import { goto } from '$app/navigation';

	export let emoji;
	export let azione;

	const chooseAzione = () => {
		switch (emoji) {
			case 'school':
				goto('/dashboard/sezioni/gestiscicdl');
				break;
			case 'assignment':
				goto('/dashboard/sezioni/gestiscicorso');
				break;
			case 'campaign':
				goto('/dashboard/sezioni/gestisciannunci');
				break;
			case 'person_off':
				goto('/dashboard/sezioni/gestiscibannati');
				break;
		}
		if (emoji == '🎓') {
		} else if (emoji == '📜') {
		}
	};
</script>

<div on:click={chooseAzione} class="container">
	<div class="left">
		<span class="material-icons">
			{emoji}
		</span>
	</div>
	<div class="right">
		<p>{azione}</p>
	</div>
</div>

<style>
	.container {
		display: flex;
		width: 100%;
		border-radius: 0.8rem;
		gap: 1rem;
		align-items: center;
		box-shadow: var(--neumorphism);
		padding: 1rem;
		transition: var(--velocita);
		cursor: pointer;
		width: 80%;
	}

	.container:hover {
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}

	.left {
		border-radius: 0.8rem;
		font-size: 2.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 600;
	}

	.right {
		font-size: 1.5rem;
	}

	@media screen and (max-width: 800px) {
		.container {
			justify-content: center;
		}
	}

	@media screen and (max-width: 400px) {
		.right {
			font-size: 1.2rem;
		}
	}
</style>
