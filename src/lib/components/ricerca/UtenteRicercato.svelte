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
        width: 300px;
        height: 100px;
        border-radius: 0.5rem;
        padding: 1rem;
        display: flex;
        gap: 1rem;
        justify-content: left;
        align-items: center;
        box-shadow: var(--neumorphism);
        margin: 1rem;
        cursor: pointer;
        transition: var(--velocita)
    }

    .utente-lista:hover{
        box-shadow: var(--innerNeu);
        transform: var(--premuto);
    }

    .avatar,img{
        width: 100px;
        height: 100px;
        border-radius: 100%;
    }
</style>