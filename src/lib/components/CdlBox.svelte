<script>

	export let nome;
    export let cdsId;
</script>

<a href={`corsodilaurea/${cdsId}`}>{nome}</a>

<style>
	a {
		text-decoration: none;
		padding: 1rem;
		background: blue;
		color: white;
		border-radius: 6px;
		cursor: pointer;
	}
</style>
