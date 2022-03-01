<script>
	export let message;
</script>

<div class="error">
	<p><span class="material-icons"> sentiment_very_dissatisfied </span></p>
	<p class="testo">Errore 404: Non trovato</p>
	<p class="messaggio">{message}</p>
</div>

<style>
    .error{
        display: grid;
        grid-template-columns: 1fr 2fr 2fr;
        place-items: center;
        text-align: center;
    }

    .error{
        font-size: 2em;
        box-shadow: var(--neumorphism);
        border-radius: 0.5em;
        margin: 1em;
        color: var(--alert);

    }
    .testo{
        padding: 0.5em;
    }

    @media screen and (max-width:500px){
        .error{
            grid-template-columns: 1fr; 
        }
    }

</style>