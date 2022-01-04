<script>
import { goto } from "$app/navigation";


    export let utente;
</script>

<div class="utente-lista" on:click={() => goto(`/profilo/${utente.id}`)}>
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
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        margin: 1rem;
        cursor: pointer;
    }

    .avatar,img{
        width: 100px;
        height: 100px;
        border-radius: 100%;
    }
</style>