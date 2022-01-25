<script>
</script>

<button class="back" on:click={() => history.back()}
	><span class="material-icons"> arrow_back </span> Indietro</button
>

<style>
	.back {
		margin: 2.5rem 1rem;
		border: none;
		background: var(--sfondo);
		box-shadow: var(--neumorphism);
		color: var(--testo);
		padding: 0.5rem;
		border-radius: 8px;
		font-size: 1.1rem;
		outline: none;
		cursor: pointer;
		display: flex;
		align-self: flex-start;
		justify-content: center;
		align-items: center;
		gap: 0.5em;
	}
</style>
