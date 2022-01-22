<script>
import { goto } from "$app/navigation";


    export let utente;
    import { fly } from "svelte/transition";
</script>

<div transition:fly={{y:100}} class="utente-lista" on:click={() => goto(`/profilo/${utente.id}`)}>
    <div class="avatar">
        <img src={utente.data().avatar} alt="">
    </div>
    <div class="nome-cognome">
        <p>{utente.data().nome} {utente.data().cognome}</p>
    </div>

</div>

<style>
    .utente-lista{
        width: 500px;
		height: 100px;
		border-radius: 0.5rem;
		padding: 1rem;
		font-size: 1.3em;
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 1rem;
		place-items: center;
		box-shadow: var(--neumorphism);
		margin: 1rem;
		cursor: pointer;
		transition: var(--velocita);
    }

    .utente-lista:hover{
        box-shadow: var(--innerNeu);
        transform: var(--premuto);
    }

    .avatar,img{
        width: 100px;
        height: 100px;
        border-radius: 100%;
        object-fit: cover;
    }
</style>