<script context="module">
	import { db } from '$lib/firebaseConfig';

	import { collection, query, where, getDocs } from 'firebase/firestore';
	// Quando la pagina si carica, prendi la lista degli esami
	export async function load({ page }) {
		const cdsid = page.params.cdsid;
		const queryToDo = query(collection(db, 'corsidelcdl'), where('cdl', '==', cdsid));
		let corsi = [];
		await getDocs(queryToDo).then((res) => {
			corsi = res.docs;
		});
		return {
			props: { corsi }
		};
	}
</script>

<script>
	import BackButton from '$lib/components/utilities/BackButton.svelte';
	import CorsoBox from '$lib/components/CorsoBox.svelte';

	export let corsi;
</script>


<BackButton />
<div class="lista">
	{#each corsi as corso}
		<CorsoBox {corso} />
	{/each}
</div>

<style>
	.lista {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}

</style>
