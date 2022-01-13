<script context="module">
	import { db } from '$lib/firebaseConfig';
	import { doc, getDoc, onSnapshot } from 'firebase/firestore';

	export async function load({ page }) {
		// Il codice del corso per caricare le
		// singole informazioni del corso
		let idcorso = page.params.idcorso;
		let corso;
		// Prenditi le info del corso con l'id passato nell'url
		await getDoc(doc(db, 'corsidelcdl', idcorso)).then((res) => {
			// Non prendo res.data() perchè potrebbe servirmi L'id
			// e non è accessibile se prendo i dati
			corso = res;
		});

		// Prova per realtime updates
		onSnapshot(doc(db, 'corsidelcdl', idcorso), (documento) => {
			corso = documento;
		});

		return {
			props: {
				corso
			}
		};
	}
</script>

<script>
	import BoxCorsoTotale from '$lib/components/corso/BoxCorsoTotale.svelte';
	import BackButton from '$lib/components/utilities/BackButton.svelte';
	import { esamiRecensiti } from '$lib/stores/recensioniStore';
	export let corso;
	export let recensito;

	// Quando nello store viene caricato il voto, la pagina viene aggiornata
	$: if ($esamiRecensiti.find((el) => el == corso.data().codiceCorso)) {
		recensito = true;
	} else recensito = false;
</script>

<svelte:head>
	<title>{corso.data().nome}</title>
</svelte:head>
<BackButton />
<BoxCorsoTotale {corso} {recensito} />
