<script>
	import { goto } from '$app/navigation';
	import { db } from '$lib/firebaseConfig';
	import { appuntiReagiti } from '$lib/stores/appuntiStore';
	import {
		collection,
		deleteDoc,
		doc,
		getDocs,
		increment,
		query,
		setDoc,
		where
	} from 'firebase/firestore';
	import { fade, fly } from 'svelte/transition';
	import ModalRevisione from '../utilities/ModalRevisione.svelte';

	export let appunto;

	const redirectProfilo = (id) => {
		goto(`/profilo/${id}`);
	};

	/**
	 * Effettua una query su: le reazioni degli appunti --> li elimina 1 a 1
	 * Decrementa il contatore degli appunti sul sito
	 */
	const eliminaAppunto = () => {
		// Elimino tute le interazioni con l'appunto
		const queryAppunti = query(collection(db, 'votiAppunti'), where('idAppunto', '==', appunto.id));
		getDocs(queryAppunti).then((data) => {
			data.docs.forEach((toDelete) => {
				let docRef = toDelete.ref;
				deleteDoc(docRef);
			});
		});
		// Elimino l'appunto da firebase
		deleteDoc(doc(db, 'appunti', appunto.id)).then(() => {
			appuntiReagiti.update((oldAppunti) =>
				oldAppunti.filter((item) => item != appunto.data().idCorso)
			);
		});
		// Decremento il contatore di appunti caricati
		setDoc(
			doc(db, 'statistiche', 'infoSito'),
			{
				numAppunti: increment(-1)
			},
			{
				merge: true
			}
		).catch((error) => {
			alert(error.message);
		});
	};
</script>

<div in:fly={{ y: 100, duration: 1000 }} out:fade class="appunto">
	<div class="up-part">
		<div class="nome-immagine">
			<div on:click={() => redirectProfilo(appunto.data().idUtente)} class="avatar">
				<img src={appunto.data().avatar} alt="" />
			</div>
			<p>{appunto.data().nome}</p>
		</div>
		<button on:click={eliminaAppunto} class="delete-appunto">🗑️</button>
	</div>

	<div class="contenuto">
		<p>{appunto.data().contenuto}</p>
	</div>

	<div class="box-bottoni">
		<div class="voti">
			<a
				class="download-button"
				target="_blank"
				href={appunto.data().urlAppunti.url}
				download={appunto.data().titoloAppunti}>⬇️ SCARICA</a
			>
			<ModalRevisione {appunto} {eliminaAppunto} />
		</div>
	</div>
</div>

<style>
	.appunto {
		padding: 0.5rem;
		border-radius: 0.8rem;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		box-shadow: var(--neumorphism);
		margin: 1rem;
	}
	.nome-immagine {
		display: flex;
		gap: 1rem;
		justify-content: left;
		align-items: center;
	}
	.avatar {
		width: 75px;
		height: 75px;
		border-radius: 50%;
		cursor: pointer;
	}

	.avatar > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
	}

	.contenuto {
		white-space: normal;
		overflow-wrap: break-word;
	}

	.voti {
		display: flex;
		gap: 1rem;
		justify-content: space-around;
		align-items: center;
	}

	button {
		border-radius: 0.5rem;
		border: none;
		outline: none;
		padding: 0.3rem;
		cursor: pointer;
	}

	.download-button {
		border-radius: 0.5rem;
		outline: none;
		padding: 0.3rem;
		text-decoration: none;
		border: var(--bordo);
		color: var(--submit);
		font-weight: 600;
		transition: var(--velocita);
		box-shadow: var(--neumorphism);
	}

	.download-button:hover {
		box-shadow: var(--submitHover);
		color: var(--sfondo);
		background-color: var(--submit);
	}
	.delete-appunto {
		display: flex;
		justify-content: center;
		align-items: center;
		align-self: center;
		border: none;
		border-radius: 100%;
		font-weight: 600;
		font-size: 1.3rem;
		color: var(--alert);
		height: 50px;
		width: 50px;
		cursor: pointer;
		transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
		position: absolute;
		margin-left: -3rem;
		margin-top: -7rem;
	}
</style>
