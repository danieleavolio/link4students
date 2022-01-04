<script>

    export let ricerca;
    export let gotoRicerca;
    import { fly } from "svelte/transition";
    

    const handleRicerca = (tipo) =>{
        gotoRicerca(tipo);
        ricerca = '';
    }
</script>


<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div transition:fly="{{y:-200, duration:400}}" class="suggerimento">
    <p on:click={() => handleRicerca('utenti')} >Cerca <span>{ricerca}</span> in Utenti  <span>👤</span></p>
    <p on:click={() => handleRicerca('corsi')}>Cerca <span>{ricerca}</span> in Corsi  <span>🎓</span></p>
    <p on:click={() => handleRicerca('appunti')}>Cerca <span>{ricerca}</span> in Appunti <span> ✒️</span></p>
</div>
<div on:click={() => ricerca = ''} class="backdrop">

</div>

<style>
.suggerimento{
    position: absolute;
    background-color: purple;
    color: white;
    border-radius: 0.5rem;
    padding: 0.3rem;
    margin-top: 0.8rem;
    z-index: 30;
}

.backdrop{
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: 20;
    top: 0;
    left: 0;
}
span{
    background-color: rgba(172, 255, 47, 0.329);
    padding: 0.1rem;
    border-radius: 0.3rem;
}

p{
    cursor: pointer;
    font-size: 1rem;
}
</style>