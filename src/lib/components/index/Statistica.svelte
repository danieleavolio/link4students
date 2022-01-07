<script>
	export let numero;
	export let nome;
</script>

<div class="container">
	<p>{nome}: <span>{numero}</span></p>
</div>

<style>

    .container{
        border-radius: 1rem;
        width: 150px;
        box-shadow: var(--innerNeu);
        border: var(--bordo);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    p{
        text-transform: uppercase;
    }

    span{
        font-weight: 600;

    }
</style>
