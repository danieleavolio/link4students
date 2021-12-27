<script>
	export let numero;
	export let nome;
</script>

<div class="container">
	<p>{nome}: <span>{numero}</span></p>
</div>

<style>

    .container{
        border-radius: 6px;
        width: 150px;
        box-shadow: 5px 5px 5px rgba(0,0,0,0.3);
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
