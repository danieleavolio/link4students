<script>
import { goto } from "$app/navigation";


	export let collegamento;

    const gotoProfilo = () => {
        goto(`/profilo/${collegamento.data().idCollegato}`)
    }
</script>

<div class="collegamento" on:click={gotoProfilo}>
	<div class="avatar">
		<img src={collegamento.data().avatarCollegato} alt="" />
	</div>

	<div class="nome-cognome">
		<p>{collegamento.data().nomeCognomeCollegato}</p>
	</div>
</div>

<style>

    .collegamento{
        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        margin: 0.5rem;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
        border-radius: 0.5rem;
        cursor: pointer;
    }
    .avatar{
        width: 50px;
        height: 50px;
        border-radius: 100%;
    }

    .avatar > img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 100%;
    }
</style>
