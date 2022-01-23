<script>
</script>

<div class="loading" />

<style>
	.loading {
		border: var(--testo) solid 10px;
		width: 25px;
		height: 25px;
		border-top: var(--sfondo) solid 10px;
		animation: loading 1s linear infinite;
		border-radius: 100%;
        margin: 1rem;
		align-self: center;
	}

	@keyframes loading {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
