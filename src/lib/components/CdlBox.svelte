<script>

	export let nome;
    export let cdsId;
</script>

<a href={`corsodilaurea/${cdsId}`}>{nome}</a>

<style>
	a {
		text-decoration: none;
		padding: 1rem;
		background: var(--sfondo);
		color: var(--testo);
		border-radius: 6px;
		cursor: pointer;
		box-shadow: var(--neumorphism);
		font-size: 1.2rem;
	}
</style>
