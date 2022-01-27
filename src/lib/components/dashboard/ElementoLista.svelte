<script>
	import { db } from '$lib/firebaseConfig';

	import { deleteDoc, doc } from 'firebase/firestore';

	import { fly } from 'svelte/transition';
	import ModalEliminaCdl from './ModalEliminaCDL.svelte';
	import ModalElimina from './ModalEliminaCDL.svelte';
	export let corso;

	const eliminaCorso = () => {
		deleteDoc(doc(db, 'corsidilaurea', corso.id));
	};
</script>

<div class="corsodilaurea">
	<p>{corso.data().nome}</p>
	<ModalEliminaCdl {corso} />
</div>

<style>
	.corsodilaurea {
		display: flex;
		padding: 0.2rem 1rem;
		box-shadow: var(--neumorphism);
		border-radius: 0.5rem;
		justify-content: space-between;
        font-weight: 500;
        font-size: 1.2rem;
		height: 100%;
		align-items: center;
	}

	
	@media screen and (max-width:350px){
		.corsodilaurea{
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text-align: center;
		}
	}
</style>
