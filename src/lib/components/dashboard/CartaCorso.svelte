<script>
import ModalModificaCorso from "../utilities/ModalModificaCorso.svelte";
	export let corso;
    let modal;

</script>

<ModalModificaCorso bind:this={modal} {corso} />


<style>
	
</style>
