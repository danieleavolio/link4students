<script>
    import { fly } from "svelte/transition";
</script>


<div transition:fly class="vuoto">
    <div class="emoji">
        <p>📁</p>
    </div>
    <div class="testo">
        <p>La ricerca non ha prodotto risultati..</p>
    </div>
</div>

<style>
    .vuoto{
        display: flex;
        gap: 1rem;
        font-size: 2rem;
        border-radius: 0.4rem;
        box-shadow: 0 5px 10px rgba(0,0,0,0.4);
        padding: 0.5rem;
        margin: 1rem;
        justify-content: center;
        align-items: center;
    }

    .emoji>p{
        font-size: 2.4rem;
    }

</style>