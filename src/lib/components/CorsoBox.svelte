
<script>
import { goto } from "$app/navigation";


    export let corso;
</script>

    <div class="card-box" on:click={() => goto(`corso/${corso.id}`)}>
        <div class="left">
            <p class="cfu">{corso.data().cfu}</p>
        </div>

        <div class="right">
            <p class="nome">{corso.data().nome}</p>
            <p class="anno">Anno - {corso.data().anno}</p>
        </div>

    </div>

<style>
    .card-box{
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .cfu{
        font-size: 2rem;
        font-weight: bold;
    }
    .nome{
        font-size: 1rem;
    }

    .anno{
        font-style: italic;
    }
    
    .left{
        padding: 0 2rem;
        background-color: rgb(230, 34, 60);
    }

    .right{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: left;
        background-color: rgb(219, 219, 219);
        width: 300px;
        padding: 0 0.2rem;

    }

</style>