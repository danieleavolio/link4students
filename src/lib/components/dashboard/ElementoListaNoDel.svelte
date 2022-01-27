<script>
	export let corso;
	export let cambiaCdlSelezionato;
</script>

<div on:click={() => cambiaCdlSelezionato(corso)} class="corsodilaurea">
	<p>{corso.data().nome}</p>
</div>

<style>
	.corsodilaurea {
		display: flex;
		padding: 0.2rem 1rem;
		box-shadow: var(--neumorphism);
		border-radius: 0.5rem;
		justify-content: space-between;
		cursor: pointer;
		transition: var(--velocita);
		font-size: 1.3em;
		height: 100%;
	}

	.corsodilaurea:hover {
		box-shadow: var(--innerNeu);
		
	}

	@media screen and (max-width:850px){
		.corsodilaurea{
			text-align: center;
			justify-content: center;
			align-items: center;
		}	
	}
</style>
