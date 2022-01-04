<script context="module">
	import { db } from '$lib/firebaseConfig';

	import { collection, getDocs, query } from 'firebase/firestore';

	export async function load({ page }) {
		let tipo = page.query.get('tipo');
		let keyword = page.query.get('keyword');

		// NON RIESCO A TROVARE UN MODO PER FARE DELLE QUERY LEGGERE OK?
		const q = query(collection(db, 'users'));
		let lista = [];
		await getDocs(q).then((results) => {
			lista = results.docs.filter((utente) =>
				utente.data().nome.toLowerCase().includes(keyword.toLowerCase())
			);
		});
		return {
			props: {
				tipo,
				keyword,
				lista
			}
		};
	}
</script>

<script>
	import UtenteRicercato from '$lib/components/ricerca/UtenteRicercato.svelte';

	export let tipo;
	export let keyword;
	export let lista;
</script>

<div class="container-ricerca">
	<div class="top-bar">
		<span>🔎</span><input type="text" value={keyword} />
		<div class="filtro">
			<button class="selezione"> 👤 </button>
			<button class="selezione"> 🎓 </button>
			<button class="selezione"> ✒️ </button>
		</div>
	</div>

	<!-- Lista risultati -->
	<div class="lista-risultati">
		{#if tipo == 'utenti'}
			{#each lista as utente}
				<UtenteRicercato {utente} />
			{/each}
		{/if}
	</div>
</div>

<style>
	input {
		font-size: 1rem;
	}
	.container-ricerca {
		width: 90%;
		display: flex;
		flex-direction: column;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
		justify-content: center;
		align-items: center;
		border-radius: 0.4rem;
	}

	.top-bar {
		display: flex;
		gap: 1rem;
		padding: 1rem;
	}

	.selezione {
		font-size: 1rem;
		border: none;
		background-color: rgb(207, 207, 207);
		padding: 1rem;
		border-radius: 0.5rem;
		cursor: pointer;
	}
</style>
