<script>
import { db } from "$lib/firebaseConfig";

import { deleteDoc, doc } from "firebase/firestore";

    import { fly } from "svelte/transition";
import ModalEliminaCdl from "./ModalEliminaCDL.svelte";
import ModalElimina from "./ModalEliminaCDL.svelte";
	export let corso;


    const eliminaCorso = () =>{
        deleteDoc(doc(db,'corsidilaurea', corso.id))
    }
</script>




<div class="corsodilaurea">
	<p>{corso.data().nome}</p>
    <ModalEliminaCdl {corso}></ModalEliminaCdl>
</div>

<style>

    .corsodilaurea{
        display: flex;
        padding: 0.2rem 1rem;
        box-shadow: 0 5px 5px rgba(0,0,0,0.4);
        border-radius: 0.5rem;
        justify-content: space-between;
        }

    

   
</style>
