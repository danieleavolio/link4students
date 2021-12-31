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
		box-shadow: 12px 12px 8px 0 rgba(0, 0, 0, 0.4);
		box-shadow: 8px -8px 8px 0 rgba(196, 196, 196, 0.4);
		border-radius: 0.5rem;
		justify-content: space-between;
        cursor: pointer;
        transition: all 0.5s ease;
	}

    .corsodilaurea:hover{
        box-shadow: 12px 12px 16px 0 rgba(255,255,255,0.3) inset;
        box-shadow: -8px -8px 16px 0 rgba(0,0,0,0.3) inset;
    }
</style>
