<script>
import { db } from "$lib/firebaseConfig";

import { deleteDoc, doc } from "firebase/firestore";

    import { fly } from "svelte/transition";
	export let corso;


    const eliminaCorso = () =>{
        deleteDoc(doc(db,'corsidilaurea', corso.id))
    }
</script>




<div class="corsodilaurea">
	<p>{corso.data().nome}</p>
    <button on:click={eliminaCorso} class="elimina-cdl">Elimina CDL</button>
</div>

<style>

    .corsodilaurea{
        display: flex;
        padding: 0.2rem 1rem;
        box-shadow: 0 5px 5px rgba(0,0,0,0.4);
        border-radius: 0.5rem;
        justify-content: space-between;
        }

    .elimina-cdl{
        background-color: darkred;
        font-size: 1rem;
        color: white;
        border-radius: 0.2rem;
        border: none;
        cursor: pointer;
        margin: 0;
        transition: all 0.5s ease;
    }

    .elimina-cdl:hover{
        background-color: rgb(105, 2, 2);
    }

   
</style>
