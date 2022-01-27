<script>
	import { goto } from '$app/navigation';
	import { db } from '$lib/firebaseConfig';
	import { appuntiReagiti } from '$lib/stores/appuntiStore';
	import { authStore } from '$lib/stores/authStore';
	import {
		collection,
		deleteDoc,
		doc,
		getDoc,
		getDocs,
		increment,
		query,
		setDoc,
		where
	} from 'firebase/firestore';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let appunto;

	// Stato del voto per non spammare
	let statoVoto = 0;
	/**
	 *
	 * @param id
	 * id dell'utente per fare il redirect del profilo.
	 * Viene chiamata la funzione goto
	 */
	const redirectProfilo = (id) => {
		goto(`/profilo/${id}`);
	};
	/**
	 * Tutte le interazioni con l'appunto vengono eliminate.
	 * L'appunto viene eliminato da fire base.
	 * Viene diminuito il contarore degli appunti totali.
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
		{#if $authStore.isLoggedIn}
			{#if $authStore.user.uid == appunto.data().idUtente}
				<button on:click={eliminaAppunto} class="delete-appunto"
					><span class="material-icons"> delete </span></button
				>
			{/if}
		{/if}
	</div>

	<div class="contenuto">
		<p class="titolo-appunti">{appunto.data().titoloAppunti}</p>
		<p>{appunto.data().contenuto}</p>
	</div>

	<div class="box-bottoni">
		<div class="voti">
			<div class="download">
				{#if appunto.data().revisionato}
					<a
						class="download-button"
						target="_blank"
						href={appunto.data().urlAppunti.url}
						download={appunto.data().titoloAppunti}
						><span class="material-icons"> file_download </span>SCARICA</a
					>
				{:else}
					<button disabled class="non-disponibile">NON DISPONBIILE</button>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.appunto {
		padding: 0.5rem;
		border-radius: 0.8rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-shadow: var(--neumorphism);
		width: 90%;
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
		transition: var(--velocita);
	}

	.avatar:hover {
		transform: var(--premuto);
	}

	.avatar > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
		border: var(--bordo);
		box-shadow: var(--neumorphism);
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
		color: var(--submit);
		font-weight: 600;
		box-shadow: var(--neumorphism);
		transition: var(--velocita);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.download-button:hover {
		color: var(--sfondo);
		background-color: var(--submit);
		box-shadow: var(--submitHover);
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
		margin-left: -2rem;
		margin-top: -6rem;
		box-shadow: var(--innerNeu);
	}

	.non-disponibile {
		opacity: 50%;
	}

	.non-disponibile:hover {
		transform: none;
		box-shadow: var(--neumorphism);
		cursor: auto;
	}

	:disabled {
		opacity: 50%;
		box-shadow: var(--neumorphism);
		cursor: auto;
	}
	.titolo-appunti {
		font-weight: 600;
		font-size: 1.3em;
	}

	@media screen and (max-width: 800px) {
		.appunto {
			width: 65vw;
			height: 100%;
		}
	}

	@media screen and (max-width: 550px) {
		.up-part {
			display: flex;
			justify-content: space-around;
		}

		.delete-appunto {
			margin: 0;
			position: relative;
		}
	}

	@media screen and (max-width: 550px) {
		.up-part {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 0.5em;
		}

		.contenuto {
			text-align: center;
		}

		.delete-appunto {
			margin: 0;
			position: relative;
		}

		.voti {
			flex-direction: column;
		}
	}
</style>
